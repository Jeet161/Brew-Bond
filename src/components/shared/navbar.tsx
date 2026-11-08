import Link from "next/link";
import { Coffee, Compass, Users, CalendarCheck, ShieldAlert, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5DFD5] bg-[#FAF7F2]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            B
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-[#1B4332]">Beyond</span>
            <span className="text-[10px] block text-[#667085] -mt-1 font-medium">Guwahati</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4A5568]">
          <Link href="/discover" className="hover:text-[#1B4332] flex items-center gap-1.5 transition-colors">
            <Compass className="w-4 h-4" />
            Discover
          </Link>
          <Link href="/circles" className="hover:text-[#1B4332] flex items-center gap-1.5 transition-colors">
            <Users className="w-4 h-4" />
            Circles
          </Link>
          <Link href="/plans" className="hover:text-[#1B4332] flex items-center gap-1.5 transition-colors">
            <CalendarCheck className="w-4 h-4" />
            My Plans
          </Link>
        </nav>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-3">
          <Link
            href="/host"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#D1C9BE] text-[#1B4332] hover:bg-[#F0ECE4] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
            Host Mode
          </Link>

          <Link
            href="/auth/signin"
            className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-[#1B4332] text-white hover:bg-[#143326] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2] border-t border-[#E5DFD5] px-6 py-2 flex justify-around items-center">
      <Link href="/discover" className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#4A5568] hover:text-[#1B4332]">
        <Compass className="w-5 h-5" />
        Discover
      </Link>
      <Link href="/circles" className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#4A5568] hover:text-[#1B4332]">
        <Users className="w-5 h-5" />
        Circles
      </Link>
      <Link href="/plans" className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#4A5568] hover:text-[#1B4332]">
        <CalendarCheck className="w-5 h-5" />
        My Plans
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#4A5568] hover:text-[#1B4332]">
        <Coffee className="w-5 h-5" />
        Profile
      </Link>
    </nav>
  );
}

