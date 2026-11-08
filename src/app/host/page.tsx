import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Navbar, MobileNav } from "@/components/shared/navbar";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CalendarPlus, Users, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default async function HostDashboard() {
  const events = await db.event.findMany({
    include: {
      venue: true,
      _count: {
        select: {
          bookings: { where: { status: "CONFIRMED" } },
        },
      },
    },
    orderBy: { startTime: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Verified Host Console
            </div>
            <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">
              Host Management Portal
            </h1>
            <p className="text-sm text-[#667085] mt-1">
              Create small-group activities, manage attendee RSVPs, and record check-ins.
            </p>
          </div>

          <Link
            href="/host/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143326] transition-colors"
          >
            <CalendarPlus className="w-4 h-4" />
            Host New Meetup
          </Link>
        </div>

        {/* Operational Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] space-y-1">
            <span className="text-xs text-[#667085]">Published Events</span>
            <div className="text-2xl font-bold text-[#1E232A]">{events.length}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] space-y-1">
            <span className="text-xs text-[#667085]">Average Group Size</span>
            <div className="text-2xl font-bold text-[#1E232A]">8–10 Seats</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#E5DFD5] space-y-1">
            <span className="text-xs text-[#667085]">Host Reputation</span>
            <div className="text-2xl font-bold text-emerald-700">4.95 ★</div>
          </div>
        </div>

        {/* Hosted Events List */}
        <div className="bg-white rounded-2xl border border-[#E5DFD5] p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-base text-[#1E232A]">Your Scheduled Experiences</h2>

          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl border border-[#F0ECE4] bg-[#FAF7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Published</Badge>
                    <span className="text-xs font-medium text-[#667085]">
                      {event.venue.name} ({event.venue.neighbourhood})
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-[#1E232A]">{event.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#667085]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {event._count.bookings} of {event.capacity} seats confirmed
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/events/${event.slug}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#D1C9BE] text-[#1B4332] hover:bg-white transition-colors"
                  >
                    Public Page
                  </Link>
                  <Link
                    href={`/host/checkin/${event.id}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1B4332] text-white hover:bg-[#143326] transition-colors"
                  >
                    Manage Check-in
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
