import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { Navbar, MobileNav } from "@/components/shared/navbar";
import { formatEventDateTime, formatCategoryName, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BookingButton } from "@/components/events/booking-button";
import {
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Calendar,
  Sparkles,
  Info,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;

  const event = await db.event.findUnique({
    where: { slug },
    include: {
      venue: true,
      host: {
        include: {
          hostProfile: true,
        },
      },
      circle: true,
      bookings: {
        where: { status: "CONFIRMED" },
        select: {
          id: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      _count: {
        select: {
          bookings: { where: { status: "CONFIRMED" } },
        },
      },
    },
  });

  if (!event || event.isSuspended) {
    notFound();
  }

  const confirmedCount = event._count.bookings;
  const spotsLeft = Math.max(0, event.capacity - confirmedCount);
  const isFull = spotsLeft <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6 w-full space-y-6">
        {/* Back breadcrumb */}
        <Link
          href="/discover"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B4332] hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Discover
        </Link>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-[#E5DFD5] p-6 md:p-8 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="default" className="text-xs font-semibold text-[#1B4332]">
              {formatCategoryName(event.category)}
            </Badge>

            {isFull ? (
              <Badge variant="warning">Event Full • Waitlist Open</Badge>
            ) : (
              <Badge variant="success">{spotsLeft} spots available</Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E232A] leading-snug">
            {event.title}
          </h1>

          {/* Quick specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#4A5568]">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F2]">
              <Clock className="w-4 h-4 text-[#E07A5F]" />
              <div>
                <span className="font-semibold block text-[#1E232A]">Date & Time</span>
                <span>{formatEventDateTime(event.startTime)} (Asia/Kolkata)</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F2]">
              <MapPin className="w-4 h-4 text-[#E07A5F]" />
              <div>
                <span className="font-semibold block text-[#1E232A]">Verified Venue</span>
                <span>{event.venue.name}, {event.venue.neighbourhood}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F2]">
              <Users className="w-4 h-4 text-[#1B4332]" />
              <div>
                <span className="font-semibold block text-[#1E232A]">Group Size</span>
                <span>Small group limited to {event.capacity} people</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F2]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-semibold block text-[#1E232A]">Cost</span>
                <span className="font-bold text-[#1B4332]">{formatINR(event.priceInPaise)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content & Action Split */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Details (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <section className="bg-white rounded-2xl border border-[#E5DFD5] p-6 space-y-3">
              <h2 className="font-bold text-base text-[#1E232A]">What to Expect</h2>
              <p className="text-sm text-[#4A5568] whitespace-pre-line leading-relaxed">
                {event.description}
              </p>
            </section>

            {/* Rules & Community Standards */}
            <section className="bg-white rounded-2xl border border-[#E5DFD5] p-6 space-y-3">
              <h2 className="font-bold text-base text-[#1E232A] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#E07A5F]" />
                Event Standards & Rules
              </h2>
              <ul className="text-xs text-[#667085] space-y-2 list-disc list-inside leading-relaxed">
                <li>Public venue meetup only — meet at {event.venue.name}.</li>
                <li>Please arrive within 10 minutes of start time.</li>
                <li>Friendship-first intent: no commercial sales pitches or unsolicited dating pressure.</li>
                {event.rules && <li>{event.rules}</li>}
              </ul>
            </section>

            {/* Host Section */}
            <section className="bg-white rounded-2xl border border-[#E5DFD5] p-6 space-y-3">
              <h2 className="font-bold text-base text-[#1E232A]">Your Host</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E9E4DC] text-[#1B4332] flex items-center justify-center font-bold text-base shrink-0">
                  {event.host.name?.[0] || "H"}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-[#1E232A]">{event.host.name}</span>
                    {event.host.hostProfile?.isVerified && (
                      <Badge variant="success" className="text-[10px] py-0 px-1.5">Verified Host</Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#667085] leading-relaxed">
                    {event.host.hostProfile?.publicBio || "Community member hosting small-group activities in Guwahati."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Booking Action Card (1 col) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5DFD5] p-6 space-y-4 sticky top-20 shadow-xs">
              <div className="space-y-1">
                <span className="text-xs text-[#667085] block">Price per person</span>
                <div className="text-2xl font-extrabold text-[#1B4332]">
                  {formatINR(event.priceInPaise)}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#F0ECE4] text-xs">
                <div className="flex justify-between text-[#4A5568]">
                  <span>Available Seats</span>
                  <span className="font-semibold text-[#1E232A]">
                    {spotsLeft} of {event.capacity}
                  </span>
                </div>
                <div className="flex justify-between text-[#4A5568]">
                  <span>Cancellation</span>
                  <span className="text-emerald-700 font-medium">Free cancellation</span>
                </div>
              </div>

              {/* Client Interactive Booking Action */}
              <BookingButton eventId={event.id} isFull={isFull} />

              <p className="text-[11px] text-center text-[#8C98A4] leading-tight">
                No credit card required for free events. Attendance confirmed instantly.
              </p>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
