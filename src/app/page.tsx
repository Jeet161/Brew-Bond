import Link from "next/link";

export const dynamic = "force-dynamic";
import { Navbar, MobileNav } from "@/components/shared/navbar";
import { getDiscoverEvents } from "@/modules/discovery/service";
import { EventCard } from "@/components/events/event-card";
import { ACTIVITY_CATEGORIES, GUWAHATI_NEIGHBOURHOODS } from "@/config/guwahati";
import { Coffee, ShieldCheck, HeartHandshake, Sparkles, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const { events } = await getDiscoverEvents({ limit: 6 });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-20 md:pb-12">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-4 pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E5DFD5]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E9E4DC] text-[#1B4332] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
            Now Live in Guwahati, Assam
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#1B4332] leading-tight">
            Not another place to scroll. <br />
            <span className="text-[#E07A5F]">A place to show up.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-[#4A5568] leading-relaxed">
            Discover small, hosted social meetups at cozy Guwahati cafes and public spaces. 
            Meet friendly people over coffee, board games, and food walks — no awkwardness, no forced networking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4332] text-white font-semibold hover:bg-[#143326] shadow-sm transition-all text-sm"
            >
              Explore This Week's Meetups
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/circles"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#D1C9BE] text-[#1B4332] font-semibold hover:bg-[#E9E4DC] transition-all text-sm"
            >
              View Active Circles
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Principles Wedge */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#E5DFD5] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1B4332] flex items-center justify-center font-bold">
            <Coffee className="w-5 h-5 text-[#1B4332]" />
          </div>
          <h2 className="font-bold text-base text-[#1E232A]">Activity First</h2>
          <p className="text-xs text-[#667085] leading-relaxed">
            Having an activity on the table (games, coffee tasting, sketch walk) removes social anxiety and sparks natural conversations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5DFD5] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
          </div>
          <h2 className="font-bold text-base text-[#1E232A]">Small Groups & Public Venues</h2>
          <p className="text-xs text-[#667085] leading-relaxed">
            Capped at 4–12 attendees. Hosted exclusively at verified neighborhood cafes in Uzan Bazaar, Christian Basti, and Pan Bazaar.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5DFD5] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E07A5F] flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5 text-[#E07A5F]" />
          </div>
          <h2 className="font-bold text-base text-[#1E232A]">Circles, Not One-Offs</h2>
          <p className="text-xs text-[#667085] leading-relaxed">
            Events flow into persistent community circles so one-time encounters easily evolve into enduring offline social bonds.
          </p>
        </div>
      </section>

      {/* Featured Guwahati Events */}
      <section className="max-w-6xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#E07A5F]">
              Guwahati Pilot
            </div>
            <h2 className="text-2xl font-bold text-[#1B4332]">
              Upcoming Meetups Near You
            </h2>
          </div>
          <Link
            href="/discover"
            className="text-xs font-bold text-[#1B4332] hover:text-[#E07A5F] flex items-center gap-1 transition-colors"
          >
            See all events in Guwahati →
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#D1C9BE] p-8 space-y-3">
            <Coffee className="w-8 h-8 text-[#8C98A4] mx-auto" />
            <h3 className="font-semibold text-sm text-[#1E232A]">No upcoming events scheduled right now</h3>
            <p className="text-xs text-[#667085]">Be the first to host a coffee conversation or game night in Guwahati!</p>
            <Link
              href="/host"
              className="inline-block mt-2 text-xs font-semibold px-4 py-2 rounded-lg bg-[#1B4332] text-white"
            >
              Apply to Host an Event
            </Link>
          </div>
        )}
      </section>

      {/* Mobile Footer Navigation */}
      <MobileNav />
    </div>
  );
}
