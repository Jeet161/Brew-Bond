import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Navbar, MobileNav } from "@/components/shared/navbar";
import { formatEventDateTime, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default async function MyPlansPage() {
  // Query demo participant bookings
  const bookings = await db.booking.findMany({
    include: {
      event: {
        include: {
          venue: true,
          host: true,
        },
      },
    },
    orderBy: { event: { startTime: "asc" } },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 w-full space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">
            My Social Plans
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Track your upcoming offline meetups, confirmed seats, and waitlist requests.
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-[#E5DFD5] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    {booking.status === "CONFIRMED" ? (
                      <Badge variant="success">Confirmed Seat</Badge>
                    ) : booking.status === "WAITLISTED" ? (
                      <Badge variant="warning">Waitlist Position #{booking.waitlistPosition || 1}</Badge>
                    ) : (
                      <Badge variant="outline">{booking.status}</Badge>
                    )}
                    <span className="text-xs text-[#8C98A4]">
                      {booking.event.venue.neighbourhood}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#1E232A]">
                    <Link href={`/events/${booking.event.slug}`} className="hover:text-[#1B4332]">
                      {booking.event.title}
                    </Link>
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#667085]">
                    <span className="flex items-center gap-1.5 font-medium text-[#1E232A]">
                      <Clock className="w-3.5 h-3.5 text-[#E07A5F]" />
                      {formatEventDateTime(booking.event.startTime)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8C98A4]" />
                      {booking.event.venue.name}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <Link
                    href={`/events/${booking.event.slug}`}
                    className="inline-block text-xs font-semibold px-4 py-2 rounded-xl bg-[#FAF7F2] text-[#1B4332] hover:bg-[#E9E4DC] transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#D1C9BE] p-8 space-y-3">
            <Calendar className="w-8 h-8 text-[#8C98A4] mx-auto" />
            <h3 className="font-semibold text-sm text-[#1E232A]">You have no active plans yet</h3>
            <p className="text-xs text-[#667085]">Browse this week's curated activities in Guwahati and reserve a spot.</p>
            <Link
              href="/discover"
              className="inline-block mt-2 text-xs font-semibold px-4 py-2 rounded-lg bg-[#1B4332] text-white"
            >
              Discover Meetups
            </Link>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
