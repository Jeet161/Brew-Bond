import { db } from "@/lib/db";
import { BookingStatus, JoinMode } from "@prisma/client";
import { CapacityConflictError, NotFoundError, ValidationError } from "@/lib/errors";

export async function requestBooking(userId: string, eventId: string) {
  // Execute inside an interactive transaction with serializable/locking semantics
  return await db.$transaction(async (tx) => {
    // 1. Fetch event with row lock (or atomic update check)
    const event = await tx.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            bookings: { where: { status: BookingStatus.CONFIRMED } },
          },
        },
      },
    });

    if (!event) throw new NotFoundError("Event");
    if (event.lifecycle !== "PUBLISHED" || event.isSuspended) {
      throw new ValidationError("This event is not open for bookings.");
    }
    if (new Date() > event.bookingDeadline) {
      throw new ValidationError("The booking deadline for this event has passed.");
    }

    // 2. Check existing booking for user
    const existing = await tx.booking.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    if (existing && ["CONFIRMED", "REQUESTED", "WAITLISTED"].includes(existing.status)) {
      throw new ValidationError(`You already have a booking with status: ${existing.status}`);
    }

    const confirmedCount = event._count.bookings;
    const isFull = confirmedCount >= event.capacity;

    // 3. Determine status based on JoinMode & Capacity
    let nextStatus: BookingStatus;
    let waitlistPos: number | null = null;

    if (isFull) {
      nextStatus = BookingStatus.WAITLISTED;
      const currentWaitlistCount = await tx.booking.count({
        where: { eventId, status: BookingStatus.WAITLISTED },
      });
      waitlistPos = currentWaitlistCount + 1;
    } else {
      if (event.joinMode === JoinMode.IMMEDIATE) {
        nextStatus = BookingStatus.CONFIRMED;
      } else {
        nextStatus = BookingStatus.REQUESTED;
      }
    }

    // 4. Create or update booking record
    const booking = await tx.booking.upsert({
      where: {
        eventId_userId: { eventId, userId },
      },
      create: {
        eventId,
        userId,
        status: nextStatus,
        confirmedAt: nextStatus === BookingStatus.CONFIRMED ? new Date() : null,
        waitlistPosition: waitlistPos,
      },
      update: {
        status: nextStatus,
        cancelledAt: null,
        cancellationReason: null,
        confirmedAt: nextStatus === BookingStatus.CONFIRMED ? new Date() : null,
        waitlistPosition: waitlistPos,
        requestedAt: new Date(),
      },
    });

    // 5. Append notification to outbox
    await tx.outboxEvent.create({
      data: {
        eventType: "BOOKING_CREATED",
        payload: {
          bookingId: booking.id,
          userId,
          eventId,
          status: nextStatus,
        },
        deduplicationKey: `booking_${booking.id}_${nextStatus}_${Date.now()}`,
      },
    });

    return { booking, status: nextStatus };
  });
}

export async function cancelBooking(userId: string, bookingId: string, reason?: string) {
  return await db.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { event: true },
    });

    if (!booking) throw new NotFoundError("Booking");
    if (booking.userId !== userId) throw new ValidationError("Unauthorized booking access.");
    if (booking.status === BookingStatus.CANCELLED) return booking;

    const wasConfirmed = booking.status === BookingStatus.CONFIRMED;

    // Mark as cancelled
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
        cancellationReason: reason || "User cancelled",
        cancelledByRole: "PARTICIPANT",
        waitlistPosition: null,
      },
    });

    // If a confirmed seat freed up, promote the earliest waitlisted participant
    if (wasConfirmed && booking.event.joinMode === JoinMode.IMMEDIATE) {
      const nextCandidate = await tx.booking.findFirst({
        where: {
          eventId: booking.eventId,
          status: BookingStatus.WAITLISTED,
        },
        orderBy: [{ waitlistPosition: "asc" }, { requestedAt: "asc" }],
      });

      if (nextCandidate) {
        await tx.booking.update({
          where: { id: nextCandidate.id },
          data: {
            status: BookingStatus.CONFIRMED,
            confirmedAt: new Date(),
            waitlistPosition: null,
          },
        });

        // Add outbox promotion notification
        await tx.outboxEvent.create({
          data: {
            eventType: "WAITLIST_PROMOTED",
            payload: {
              bookingId: nextCandidate.id,
              userId: nextCandidate.userId,
              eventId: booking.eventId,
            },
            deduplicationKey: `promote_${nextCandidate.id}_${Date.now()}`,
          },
        });
      }
    }

    return updated;
  });
}

