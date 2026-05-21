"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { EmailHistoryCard } from "@/components/EmailHistoryCard";
import { Button } from "@/components/ui/button";
import { Zap, ArrowLeft, History, Loader2, Lock } from "lucide-react";
import type { SequenceEmail } from "@/lib/claude";

interface HistoryRecord {
  id: string;
  type: "single" | "sequence";
  prospect_name: string | null;
  prospect_company: string | null;
  tone: string | null;
  subject: string | null;
  body: string | null;
  sequence: SequenceEmail[] | null;
  created_at: string;
}

const FREE_HISTORY_LIMIT = 5;

export default function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [plan, setPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: profile }, { data: history }] = await Promise.all([
        supabase.from("profiles").select("plan").eq("id", user.id).single(),
        supabase
          .from("email_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100),
      ]);

      setPlan(profile?.plan ?? "free");
      setRecords((history as HistoryRecord[]) ?? []);
      setLoading(false);
    }

    load();
  }, []);

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const isFree = plan === "free";
  const visible = isFree ? records.slice(0, FREE_HISTORY_LIMIT) : records;
  const locked = isFree ? records.slice(FREE_HISTORY_LIMIT) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">MailBlitz</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
              <History className="w-4 h-4" />
              History
            </div>
          </div>
          {records.length > 0 && (
            <span className="text-xs text-gray-400">{records.length} email{records.length !== 1 ? "s" : ""} saved</span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading history...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20">
            <History className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-400">No emails generated yet</p>
            <p className="text-xs text-gray-300 mt-1 mb-6">Your emails will appear here after you generate them</p>
            <Link href="/dashboard">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Generate your first email →
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((record) => (
              <EmailHistoryCard key={record.id} record={record} onDelete={handleDelete} />
            ))}

            {/* Locked records for free users */}
            {locked.length > 0 && (
              <div className="relative">
                <div className="space-y-3 opacity-40 pointer-events-none select-none">
                  {locked.slice(0, 2).map((record) => (
                    <EmailHistoryCard key={record.id} record={record} onDelete={() => {}} />
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white flex items-end justify-center pb-6">
                  <div className="text-center bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
                    <Lock className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      {locked.length} older email{locked.length !== 1 ? "s" : ""} locked
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Upgrade to Pro for full 30-day history
                    </p>
                    <Link href="/pricing">
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        Upgrade to Pro →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
