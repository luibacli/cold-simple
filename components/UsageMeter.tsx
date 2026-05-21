"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Loader2 } from "lucide-react";

interface UsageData {
  used: number;
  limit: number | null;
  plan: "free" | "pro" | "team";
}

interface UsageMeterProps {
  refreshKey?: number;
}

export function UsageMeter({ refreshKey = 0 }: UsageMeterProps) {
  const [data, setData] = useState<UsageData | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setData);
  }, [refreshKey]);

  if (!data) {
    return (
      <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        <span className="text-xs text-gray-400">Loading usage...</span>
      </div>
    );
  }

  const isUnlimited = data.limit === null;
  const percent = isUnlimited ? 100 : Math.min(((data.used) / data.limit!) * 100, 100);
  const remaining = isUnlimited ? "∞" : Math.max(data.limit! - data.used, 0);

  return (
    <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
      <Zap className="w-4 h-4 text-indigo-500 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500 font-medium">
            {isUnlimited ? "Unlimited emails" : `${remaining} of ${data.limit} emails remaining`}
          </span>
          <Badge
            variant={data.plan === "free" ? "secondary" : "default"}
            className={data.plan !== "free" ? "bg-indigo-600 text-white" : ""}
          >
            {data.plan.toUpperCase()}
          </Badge>
        </div>
        {!isUnlimited && <Progress value={percent} className="h-1.5" />}
      </div>
      {data.plan === "free" && (
        <a
          href="/pricing"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 shrink-0 transition-colors"
        >
          Upgrade →
        </a>
      )}
    </div>
  );
}
