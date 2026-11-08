import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-[#1B4332] text-white hover:bg-[#143326] focus-visible:ring-[#1B4332]",
    secondary: "bg-[#E9E4DC] text-[#1B4332] hover:bg-[#DDD7CC] focus-visible:ring-[#1B4332]",
    outline: "border border-[#D1C9BE] text-[#1E232A] hover:bg-[#F0ECE4] focus-visible:ring-[#1B4332]",
    ghost: "text-[#1E232A] hover:bg-[#F0ECE4] focus-visible:ring-[#1B4332]",
    accent: "bg-[#E07A5F] text-white hover:bg-[#CC6D54] focus-visible:ring-[#E07A5F]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

