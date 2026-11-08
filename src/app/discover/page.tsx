import Link from "next/link";

export const dynamic = "force-dynamic";
import { Navbar, MobileNav } from "@/components/shared/navbar";
import { getDiscoverEvents } from "@/modules/discovery/service";
import { EventCard } from "@/components/events/event-card";
import { ACTIVITY_CATEGORIES, GUWAHATI_NEIGHBOURHOODS } from "@/config/guwahati";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";

interface DiscoverPageProps {
  searchParams: Promise<{
    category?: string;
    neighbourhood?: string;
    q?: string;
  }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const params = await searchParams;
  const currentCategory = params.category || "ALL";
  const currentNeighbourhood = params.neighbourhood || "ALL";
  const searchQuery = params.q || "";

  const { events, totalCount } = await getDiscoverEvents({
    category: currentCategory,
    neighbourhood: currentNeighbourhood,
    search: searchQuery,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">
            Discover Real-World Meetups
          </h1>
          <p className="text-sm text-[#667085] mt-1">
            Showing upcoming small-group experiences in Guwahati ({totalCount} events found)
          </p>
        </div>

        {/* Filter Bar with URL-persisted state */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5] space-y-3 shadow-xs">
          {/* Neighbourhood Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="font-semibold text-[#1E232A] flex items-center gap-1 shrink-0 pr-2 border-r border-[#E5DFD5]">
              <MapPin className="w-3.5 h-3.5 text-[#E07A5F]" />
              Area:
            </span>
            <Link
              href={`/discover?category=${currentCategory}&neighbourhood=ALL`}
              className={`px-3 py-1.5 rounded-full shrink-0 font-medium transition-colors ${
                currentNeighbourhood === "ALL"
                  ? "bg-[#1B4332] text-white"
                  : "bg-[#F0ECE4] text-[#4A5568] hover:bg-[#E5DFD5]"
              }`}
            >
              All Guwahati
            </Link>
            {GUWAHATI_NEIGHBOURHOODS.map((area) => (
              <Link
                key={area}
                href={`/discover?category=${currentCategory}&neighbourhood=${encodeURIComponent(area)}`}
                className={`px-3 py-1.5 rounded-full shrink-0 font-medium transition-colors ${
                  currentNeighbourhood === area
                    ? "bg-[#1B4332] text-white"
                    : "bg-[#F0ECE4] text-[#4A5568] hover:bg-[#E5DFD5]"
                }`}
              >
                {area}
              </Link>
            ))}
          </div>

          {/* Activity Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar pt-1 border-t border-[#F0ECE4]">
            <Link
              href={`/discover?category=ALL&neighbourhood=${currentNeighbourhood}`}
              className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-colors ${
                currentCategory === "ALL"
                  ? "bg-[#1B4332] text-white"
                  : "bg-[#F0ECE4] text-[#4A5568] hover:bg-[#E5DFD5]"
              }`}
            >
              All Activities
            </Link>
            {ACTIVITY_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/discover?category=${cat.id}&neighbourhood=${currentNeighbourhood}`}
                className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-colors ${
                  currentCategory === cat.id
                    ? "bg-[#1B4332] text-white"
                    : "bg-[#F0ECE4] text-[#4A5568] hover:bg-[#E5DFD5]"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#D1C9BE] p-8 space-y-3">
            <h3 className="font-semibold text-base text-[#1E232A]">No meetups match your current filters</h3>
            <p className="text-xs text-[#667085]">Try selecting "All Guwahati" or "All Activities" to see more plans.</p>
            <Link
              href="/discover"
              className="inline-block mt-2 text-xs font-semibold px-4 py-2 rounded-lg bg-[#1B4332] text-white"
            >
              Reset Filters
            </Link>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
