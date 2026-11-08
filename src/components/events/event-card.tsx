import Link from "next/link";
import { formatEventDateTime, formatCategoryName, formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, CheckCircle, Clock } from "lucide-react";

export interface EventCardProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  startTime: string;
  endTime: string;
  capacity: number;
  confirmedCount: number;
  spotsLeft: number;
  priceInPaise: number;
  joinMode: string;
  venue: {
    name: string;
    neighbourhood: string;
    city: string;
  };
  host: {
    name: string;
    isVerified: boolean;
    rating: number;
  };
}

export function EventCard({ event }: { event: EventCardProps }) {
  const isFull = event.spotsLeft <= 0;

  return (
    <article className="group relative bg-white border border-[#E5DFD5] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#D1C9BE] transition-all flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="default" className="text-[11px] font-semibold text-[#1B4332]">
            {formatCategoryName(event.category)}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            {isFull ? (
              <Badge variant="warning">Waitlist Only</Badge>
            ) : (
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-xs">
                {event.spotsLeft} {event.spotsLeft === 1 ? "spot" : "spots"} left
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base text-[#1E232A] group-hover:text-[#1B4332] transition-colors line-clamp-2 mb-2">
          <Link href={`/events/${event.slug}`} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {event.title}
          </Link>
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-[#667085] line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>

        {/* Event Logistics */}
        <div className="space-y-1.5 text-xs text-[#4A5568] mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#8C98A4] shrink-0" />
            <span className="font-medium text-[#1E232A]">
              {formatEventDateTime(event.startTime)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#8C98A4] shrink-0" />
            <span className="truncate">
              {event.venue.name}, <span className="font-medium text-[#1B4332]">{event.venue.neighbourhood}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer Host & Details */}
      <div className="pt-3 border-t border-[#F0ECE4] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#4A5568]">
          <div className="w-5 h-5 rounded-full bg-[#E9E4DC] flex items-center justify-center font-bold text-[10px] text-[#1B4332]">
            {event.host.name[0]}
          </div>
          <span className="truncate max-w-[110px]">{event.host.name}</span>
          {event.host.isVerified && (
            <CheckCircle className="w-3 h-3 text-emerald-600 fill-emerald-100" />
          )}
        </div>

        <div className="text-right">
          <span className="font-bold text-[#1B4332]">
            {formatINR(event.priceInPaise)}
          </span>
        </div>
      </div>
    </article>
  );
}

