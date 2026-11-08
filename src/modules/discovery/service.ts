import { db } from "@/lib/db";
import { EventLifecycle, EventCategory } from "@prisma/client";

export interface DiscoverFilters {
  category?: string;
  neighbourhood?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getDiscoverEvents(filters: DiscoverFilters = {}) {
  const { category, neighbourhood, search, limit = 12, offset = 0 } = filters;

  const whereClause: Record<string, unknown> = {
    lifecycle: EventLifecycle.PUBLISHED,
    isSuspended: false,
    startTime: {
      gte: new Date(), // upcoming only
    },
  };

  if (category && category !== "ALL") {
    whereClause.category = category as EventCategory;
  }

  if (neighbourhood && neighbourhood !== "ALL") {
    whereClause.venue = {
      neighbourhood: neighbourhood,
    };
  }

  if (search && search.trim() !== "") {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [events, totalCount] = await Promise.all([
    db.event.findMany({
      where: whereClause,
      include: {
        venue: {
          select: {
            name: true,
            address: true,
            neighbourhood: true,
            city: true,
          },
        },
        host: {
          select: {
            name: true,
            image: true,
            hostProfile: {
              select: {
                isVerified: true,
                ratingAverage: true,
                totalEventsHosted: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookings: {
              where: { status: "CONFIRMED" },
            },
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
      take: limit,
      skip: offset,
    }),
    db.event.count({ where: whereClause }),
  ]);

  return {
    events: events.map((e) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      description: e.description,
      category: e.category,
      startTime: e.startTime.toISOString(),
      endTime: e.endTime.toISOString(),
      capacity: e.capacity,
      confirmedCount: e._count.bookings,
      spotsLeft: Math.max(0, e.capacity - e._count.bookings),
      priceInPaise: e.priceInPaise,
      joinMode: e.joinMode,
      venue: e.venue,
      host: {
        name: e.host.name || "Anonymous Host",
        image: e.host.image,
        isVerified: e.host.hostProfile?.isVerified ?? false,
        rating: e.host.hostProfile?.ratingAverage ?? 5.0,
      },
    })),
    totalCount,
    hasMore: offset + limit < totalCount,
  };
}

