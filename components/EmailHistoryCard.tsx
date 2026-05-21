"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, ChevronDown, ChevronUp, Trash2, Mail, Layers } from "lucide-react";
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-600 transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

const DAY_COLORS: Record<number, string> = {
  0: "bg-indigo-50 text-indigo-700",
  3: "bg-amber-50 text-amber-700",
  7: "bg-rose-50 text-rose-700",
};

export function EmailHistoryCard({ record, onDelete }: { record: HistoryRecord; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await fetch(`/api/history/${record.id}`, { method: "DELETE" });
    onDelete(record.id);
  };

  const date = new Date(record.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      {/* Header row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${record.type === "sequence" ? "bg-indigo-100" : "bg-gray-100"}`}>
          {record.type === "sequence"
            ? <Layers className="w-4 h-4 text-indigo-600" />
            : <Mail className="w-4 h-4 text-gray-500" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {record.prospect_name ?? "Unknown"} — {record.prospect_company ?? "Unknown"}
            </p>
            <Badge variant="secondary" className="text-xs shrink-0 capitalize">
              {record.type === "sequence" ? "Sequence" : record.tone ?? "email"}
            </Badge>
          </div>
          <p className="text-xs text-gray-400 truncate">
            {record.type === "single" ? record.subject : `3-email sequence`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-gray-400 hidden sm:block">{date}</span>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            disabled={deleting}
            className="p-1 text-gray-300 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-3">
          {record.type === "single" && record.subject && record.body && (
            <>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Subject</p>
                  <CopyButton text={`Subject: ${record.subject}\n\n${record.body}`} />
                </div>
                <p className="text-sm font-semibold text-gray-800">{record.subject}</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Body</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{record.body}</p>
              </div>
            </>
          )}

          {record.type === "sequence" && record.sequence && (
            <div className="space-y-3">
              {record.sequence.map((email, i) => (
                <div key={i} className="rounded-lg border border-gray-100 overflow-hidden">
                  <div className={`px-3 py-1.5 flex items-center justify-between ${DAY_COLORS[email.day] ?? "bg-gray-50"}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">Day {email.day}</span>
                      <span className="text-xs">{email.label}</span>
                    </div>
                    <CopyButton text={`Subject: ${email.subject}\n\n${email.body}`} />
                  </div>
                  <div className="px-3 py-2 bg-white">
                    <p className="text-xs font-semibold text-gray-700 mb-1">{email.subject}</p>
                    <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{email.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
