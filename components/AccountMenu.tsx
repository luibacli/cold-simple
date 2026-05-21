"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, CreditCard, ChevronDown } from "lucide-react";

interface AccountMenuProps {
  email: string;
  plan: string;
}

export function AccountMenu({ email, plan }: AccountMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const openPortal = async () => {
    setLoadingPortal(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoadingPortal(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-700">
          {email[0].toUpperCase()}
        </div>
        <span className="hidden sm:block max-w-32 truncate">{email}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-50">
              <p className="text-xs text-gray-400 truncate">{email}</p>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mt-0.5">
                {plan} plan
              </p>
            </div>
            {plan !== "free" && (
              <button
                onClick={openPortal}
                disabled={loadingPortal}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                {loadingPortal ? "Opening..." : "Manage billing"}
              </button>
            )}
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
