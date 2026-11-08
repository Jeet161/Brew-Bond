"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export function BookingButton({ eventId, isFull }: { eventId: string; isFull: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "confirmed" | "waitlisted" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleJoin() {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reserve spot");
      }

      if (data.status === "WAITLISTED") {
        setStatus("waitlisted");
      } else {
        setStatus("confirmed");
      }
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "confirmed") {
    return (
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Seat Confirmed!
        </div>
        <p className="text-xs text-emerald-700">
          You're all set. We've added this meetup to your plans.
        </p>
      </div>
    );
  }

  if (status === "waitlisted") {
    return (
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-amber-800 font-bold text-sm">
          <CheckCircle2 className="w-4 h-4 text-amber-600" />
          Added to Waitlist!
        </div>
        <p className="text-xs text-amber-700">
          If a confirmed attendee cancels, you will automatically be promoted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleJoin}
        disabled={status === "loading"}
        variant={isFull ? "outline" : "primary"}
        className="w-full py-3 font-semibold shadow-xs"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Securing Spot...
          </span>
        ) : isFull ? (
          "Join Waitlist"
        ) : (
          "Join This Meetup"
        )}
      </Button>

      {status === "error" && (
        <div className="flex items-start gap-1.5 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

