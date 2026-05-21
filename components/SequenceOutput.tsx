"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Mail } from "lucide-react";
import { SendEmailButton } from "@/components/SendEmailButton";
import type { SequenceEmail } from "@/lib/claude";

const DAY_COLORS: Record<number, string> = {
  0: "bg-indigo-100 text-indigo-700 border-indigo-200",
  3: "bg-amber-100 text-amber-700 border-amber-200",
  7: "bg-rose-100 text-rose-700 border-rose-200",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors font-medium"
    >
      {copied ? (
        <><Check className="w-3.5 h-3.5 text-green-500" /><span className="text-green-500">Copied!</span></>
      ) : (
        <><Copy className="w-3.5 h-3.5" />Copy</>
      )}
    </button>
  );
}

interface SequenceOutputProps {
  sequence: SequenceEmail[];
  isLoading: boolean;
}

export function SequenceOutput({ sequence, isLoading }: SequenceOutputProps) {
  if (isLoading) {
    return (
      <Card className="border-dashed border-2 border-indigo-200 bg-indigo-50/30">
        <CardContent className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Claude is writing your sequence...</p>
        </CardContent>
      </Card>
    );
  }

  if (sequence.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
        <CardContent className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <Mail className="w-10 h-10 text-gray-300" />
          <div>
            <p className="text-sm font-medium text-gray-400">Your 3-email sequence will appear here</p>
            <p className="text-xs text-gray-300 mt-1">Fill in the form and click Generate Sequence</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {sequence.map((email, i) => (
        <div key={i} className="flex gap-3">
          {/* Timeline spine */}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${DAY_COLORS[email.day]}`}>
              {i + 1}
            </div>
            {i < sequence.length - 1 && (
              <div className="w-px flex-1 bg-gray-200 my-1 min-h-4" />
            )}
          </div>

          {/* Email card */}
          <div className="flex-1 pb-1">
            <Card className="border-gray-100 shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${DAY_COLORS[email.day]}`}>
                    Day {email.day}
                  </span>
                  <span className="text-xs font-medium text-gray-500">{email.label}</span>
                </div>
                <CopyButton text={`Subject: ${email.subject}\n\n${email.body}`} />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Subject</p>
                  <p className="text-sm font-semibold text-gray-800">{email.subject}</p>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Body</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{email.body}</p>
                </div>
                <SendEmailButton subject={email.subject} body={email.body} />
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
}
