import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { requestBooking } from "@/modules/bookings/service";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    let userId = session?.user?.id;

    // In local demo mode, if not authenticated, fallback to a seeded participant user
    if (!userId && process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      let demoUser = await db.user.findFirst({
        where: { email: "priya.participant@beyondmeet.in" },
      });

      if (!demoUser) {
        demoUser = await db.user.create({
          data: {
            email: "priya.participant@beyondmeet.in",
            name: "Priya Sharma",
            role: "PARTICIPANT",
            isAgeEligible: true,
            profile: {
              create: {
                displayName: "Priya S.",
                city: "Guwahati",
                neighbourhood: "Pan Bazaar",
                isOnboarded: true,
              },
            },
          },
        });
      }
      userId = demoUser.id;
    }

    if (!userId) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json({ message: "Missing eventId" }, { status: 400 });
    }

    const result = await requestBooking(userId, eventId);
    return NextResponse.json({ success: true, booking: result.booking, status: result.status });
  } catch (error: unknown) {
    console.error("Booking error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 400 });
  }
}

