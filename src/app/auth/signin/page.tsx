"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Coffee } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  async function handleDemoLogin(email: string, roleName: string) {
    setLoadingRole(roleName);
    await signIn("demo-login", {
      email,
      callbackUrl: "/discover",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#E5DFD5] p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-sm">
            B
          </div>
          <h1 className="text-2xl font-extrabold text-[#1B4332]">Welcome to Beyond</h1>
          <p className="text-xs text-[#667085]">
            Meet beyond your circle. Real-world social discovery in Guwahati.
          </p>
        </div>

        {/* Demo Impersonation for Local Dev */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E232A]">
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
            Select a Demo Account (1-Click Switch):
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleDemoLogin("priya.participant@beyondmeet.in", "participant")}
              disabled={loadingRole !== null}
              className="w-full text-left p-3.5 rounded-xl border border-[#E5DFD5] hover:border-[#1B4332] hover:bg-[#FAF7F2] transition-all flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-bold text-xs text-[#1E232A] block">Priya Sharma</span>
                <span className="text-[11px] text-[#667085]">Participant (Looking to join coffee & games)</span>
              </div>
              <span className="text-xs font-semibold text-[#1B4332]">Login →</span>
            </button>

            <button
              onClick={() => handleDemoLogin("ananya.host@beyondmeet.in", "host")}
              disabled={loadingRole !== null}
              className="w-full text-left p-3.5 rounded-xl border border-[#E5DFD5] hover:border-[#1B4332] hover:bg-[#FAF7F2] transition-all flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-bold text-xs text-[#1E232A] block">Ananya Barua</span>
                <span className="text-[11px] text-[#667085]">Approved Host (Riverside Coffee Talks)</span>
              </div>
              <span className="text-xs font-semibold text-[#1B4332]">Login →</span>
            </button>

            <button
              onClick={() => handleDemoLogin("admin@beyondmeet.in", "admin")}
              disabled={loadingRole !== null}
              className="w-full text-left p-3.5 rounded-xl border border-[#E5DFD5] hover:border-[#1B4332] hover:bg-[#FAF7F2] transition-all flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-bold text-xs text-[#1E232A] block">Moderation Lead</span>
                <span className="text-[11px] text-[#667085]">Admin / Trust & Safety Operator</span>
              </div>
              <span className="text-xs font-semibold text-[#1B4332]">Login →</span>
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-[#F0ECE4] text-center">
          <Link href="/discover" className="text-xs text-[#667085] hover:text-[#1B4332] underline">
            Continue as Guest to Discover
          </Link>
        </div>
      </div>
    </div>
  );
}

