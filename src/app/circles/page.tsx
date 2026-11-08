import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Navbar, MobileNav } from "@/components/shared/navbar";
import { formatCategoryName } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Users, Sparkles, Plus, Calendar } from "lucide-react";

export default async function CirclesPage() {
  const circles = await db.circle.findMany({
    where: { status: "ACTIVE" },
    include: {
      owner: {
        select: { name: true },
      },
      _count: {
        select: {
          memberships: { where: { status: "ACTIVE" } },
          events: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] pb-24 md:pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">
              Persistent Social Circles
            </h1>
            <p className="text-sm text-[#667085] mt-1">
              Circles turn one-time encounters into continuing communities with recurring meetups.
            </p>
          </div>

          <Link
            href="/circles/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143326] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Start a Circle
          </Link>
        </div>

        {/* Circles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((circle) => (
            <article
              key={circle.id}
              className="bg-white border border-[#E5DFD5] rounded-2xl p-6 shadow-xs hover:border-[#D1C9BE] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="text-[11px] font-semibold text-[#1B4332]">
                    {formatCategoryName(circle.category)}
                  </Badge>
                  <span className="text-xs text-[#8C98A4] flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    {circle._count.memberships} members
                  </span>
                </div>

                <h2 className="font-bold text-lg text-[#1E232A]">
                  <Link href={`/circles/${circle.slug}`} className="hover:text-[#1B4332]">
                    {circle.name}
                  </Link>
                </h2>

                <p className="text-xs text-[#667085] line-clamp-3 leading-relaxed">
                  {circle.purpose}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F0ECE4] flex items-center justify-between text-xs">
                <span className="text-[#8C98A4]">
                  Organized by <strong className="text-[#1E232A]">{circle.owner.name}</strong>
                </span>

                <Link
                  href={`/circles/${circle.slug}`}
                  className="font-bold text-[#1B4332] hover:text-[#E07A5F] transition-colors"
                >
                  Join Circle →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
