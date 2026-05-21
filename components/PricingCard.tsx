"use client";

import React from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: number;
  features: string[];
  highlight?: boolean;
  badge?: string;
  cta?: string;
  href?: string;
  customCta?: React.ReactNode;
}

export function PricingCard({
  name,
  price,
  features,
  highlight = false,
  badge,
  cta = "Get Started",
  href = "#",
  customCta,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-8 flex flex-col gap-6 transition-all",
        highlight
          ? "border-indigo-500 shadow-xl shadow-indigo-100 bg-indigo-600 text-white scale-[1.03]"
          : "border-gray-200 bg-white shadow-sm hover:shadow-md"
      )}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-amber-400 text-amber-900 font-bold px-3 py-1 shadow">
            {badge}
          </Badge>
        </div>
      )}

      <div>
        <p className={cn("text-sm font-semibold uppercase tracking-wider mb-2", highlight ? "text-indigo-200" : "text-gray-400")}>
          {name}
        </p>
        <div className="flex items-end gap-1">
          <span className={cn("text-5xl font-bold", highlight ? "text-white" : "text-gray-900")}>
            ${price}
          </span>
          <span className={cn("text-sm mb-2", highlight ? "text-indigo-200" : "text-gray-400")}>/month</span>
        </div>
      </div>

      <ul className="space-y-3 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check
              className={cn(
                "w-4 h-4 mt-0.5 shrink-0",
                highlight ? "text-indigo-200" : "text-indigo-500"
              )}
            />
            <span className={cn("text-sm", highlight ? "text-indigo-100" : "text-gray-600")}>{f}</span>
          </li>
        ))}
      </ul>

      {customCta ?? (
        <a
          href={href}
          className={cn(
            "w-full font-semibold h-11 inline-flex items-center justify-center rounded-md text-sm transition-colors",
            highlight
              ? "bg-white text-indigo-600 hover:bg-indigo-50"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          )}
        >
          {cta}
        </a>
      )}
    </div>
  );
}
