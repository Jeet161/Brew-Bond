import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(paise: number): string {
  if (paise === 0) return "Free";
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function formatEventDateTime(date: Date | string, timezone: string = "Asia/Kolkata"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

export function formatCategoryName(category: string): string {
  const map: Record<string, string> = {
    COFFEE_CONVERSATION: "Coffee Conversation",
    BOARD_GAMES: "Board Games",
    FOOD_WALK: "Food Walk",
    PHOTOGRAPHY_WALK: "Photography Walk",
    CREATIVE_WORKSHOP: "Creative Workshop",
    BEGINNER_SPORTS: "Beginner Sports",
    OTHER: "Social Activity",
  };
  return map[category] || category;
}

