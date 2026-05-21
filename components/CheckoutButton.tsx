"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutButtonProps {
  plan: "pro" | "team";
  label: string;
  highlight?: boolean;
}

export function CheckoutButton({ plan, label, highlight = false }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      // Not logged in — redirect to signup first
      window.location.href = `/auth/signup?redirect=/pricing`;
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "w-full h-11 rounded-md font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors",
        highlight
          ? "bg-white text-indigo-600 hover:bg-indigo-50"
          : "bg-indigo-600 text-white hover:bg-indigo-700",
        loading && "opacity-70 cursor-not-allowed"
      )}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? "Redirecting..." : label}
    </button>
  );
}
