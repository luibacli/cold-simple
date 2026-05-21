"use client";

import { useState } from "react";
import { Mail, Layers, Upload } from "lucide-react";
import { EmailGenerator } from "@/components/EmailGenerator";
import { BulkGenerator } from "@/components/BulkGenerator";

type Tab = "single" | "sequence" | "bulk";

interface Props {
  plan: string;
}

export function DashboardTabs({ plan }: Props) {
  const [tab, setTab] = useState<Tab>("single");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("single")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "single" ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Single Email
        </button>
        <button
          onClick={() => setTab("sequence")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "sequence" ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          3-Email Sequence
          <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-semibold">Pro</span>
        </button>
        <button
          onClick={() => setTab("bulk")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "bulk" ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Bulk CSV
          <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-semibold">Pro</span>
        </button>
      </div>

      {tab === "bulk" ? (
        <BulkGenerator plan={plan} />
      ) : (
        <EmailGenerator defaultMode={tab === "sequence" ? "sequence" : "single"} />
      )}
    </div>
  );
}
