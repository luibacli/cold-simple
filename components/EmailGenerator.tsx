"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmailOutput } from "@/components/EmailOutput";
import { SequenceOutput } from "@/components/SequenceOutput";
import { UsageMeter } from "@/components/UsageMeter";
import type { SequenceEmail } from "@/lib/claude";

interface EmailVariant { subject: string; body: string }

type Mode = "single" | "sequence";

const DEFAULT_FORM = {
  prospectName: "",
  prospectCompany: "",
  prospectRole: "",
  industry: "",
  painPoint: "",
  yourName: "",
  yourOffer: "",
  cta: "",
  tone: "professional" as const,
  emailType: "cold" as const,
  variants: 1,
};

function SparklesIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

interface EmailGeneratorProps {
  defaultMode?: Mode;
}

export function EmailGenerator({ defaultMode = "single" }: EmailGeneratorProps) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [emails, setEmails] = useState<EmailVariant[]>([]);
  const [sequence, setSequence] = useState<SequenceEmail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [usageRefreshKey, setUsageRefreshKey] = useState(0);

  const set = (field: string, value: string | number | null) =>
    setForm((prev) => ({ ...prev, [field]: value ?? "" }));

  const handleGenerate = async () => {
    setError("");
    setIsLoading(true);
    setEmails([]);
    setSequence([]);

    const endpoint = mode === "sequence" ? "/api/generate-sequence" : "/api/generate";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (mode === "sequence") {
        setSequence(data.sequence);
      } else {
        setEmails(data.emails);
      }
      setUsageRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    form.prospectName && form.prospectCompany && form.prospectRole &&
    form.industry && form.painPoint && form.yourName && form.yourOffer && form.cta;

  return (
    <div className="space-y-4">
      <UsageMeter refreshKey={usageRefreshKey} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Form */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-800">
              {mode === "sequence" ? "Sequence Details" : "Email Details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Prospect */}
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">About the Prospect</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">First Name</Label>
                  <Input placeholder="Alex" value={form.prospectName} onChange={(e) => set("prospectName", e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Company</Label>
                  <Input placeholder="Acme Corp" value={form.prospectCompany} onChange={(e) => set("prospectCompany", e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Role / Title</Label>
                  <Input placeholder="Head of Sales" value={form.prospectRole} onChange={(e) => set("prospectRole", e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Industry</Label>
                  <Input placeholder="SaaS / E-commerce" value={form.industry} onChange={(e) => set("industry", e.target.value)} className="h-9 text-sm" />
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <Label className="text-xs">Their Main Pain Point</Label>
                <Textarea placeholder="e.g. Struggling to scale outbound without a big team" value={form.painPoint} onChange={(e) => set("painPoint", e.target.value)} className="text-sm resize-none h-20" />
              </div>
            </div>

            <Separator />

            {/* Offer */}
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">About Your Offer</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Your Name</Label>
                  <Input placeholder="Jordan" value={form.yourName} onChange={(e) => set("yourName", e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">What You Do / Your Offer</Label>
                  <Textarea placeholder="e.g. We help SaaS companies book 20+ demos/month using AI-powered outbound" value={form.yourOffer} onChange={(e) => set("yourOffer", e.target.value)} className="text-sm resize-none h-20" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Call to Action</Label>
                  <Input placeholder="Book a 15-min call / Reply with interest" value={form.cta} onChange={(e) => set("cta", e.target.value)} className="h-9 text-sm" />
                </div>
              </div>
            </div>

            <Separator />

            {/* Style */}
            <div>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">Style</p>
              <div className={`grid gap-3 ${mode === "single" ? "grid-cols-3" : "grid-cols-2"}`}>
                <div className="space-y-1.5">
                  <Label className="text-xs">Tone</Label>
                  <Select value={form.tone} onValueChange={(v) => set("tone", v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {mode === "single" && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Type</Label>
                      <Select value={form.emailType} onValueChange={(v) => set("emailType", v)}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cold">Cold Outreach</SelectItem>
                          <SelectItem value="followup">Follow-up</SelectItem>
                          <SelectItem value="linkedin">LinkedIn DM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Variants</Label>
                      <Select value={String(form.variants)} onValueChange={(v) => v && set("variants", parseInt(v))}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 variant</SelectItem>
                          <SelectItem value="2">2 variants</SelectItem>
                          <SelectItem value="3">3 variants</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                {mode === "sequence" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Emails</Label>
                    <div className="h-9 bg-gray-50 border border-gray-200 rounded-md flex items-center px-3 text-sm text-gray-500">
                      Day 0 · Day 3 · Day 7
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className={`text-xs rounded-lg px-3 py-2 ${
                error.includes("Upgrade") || error.includes("limit")
                  ? "bg-amber-50 border border-amber-200 text-amber-700"
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}>
                {error}
                {(error.includes("Upgrade") || error.includes("limit")) && (
                  <a href="/pricing" className="ml-2 font-semibold underline">Upgrade →</a>
                )}
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={!isFormValid || isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 gap-2"
            >
              <SparklesIcon />
              {isLoading
                ? mode === "sequence" ? "Writing sequence..." : "Generating..."
                : mode === "sequence" ? "Generate Sequence" : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        {/* Right — Output */}
        <div>
          {mode === "sequence"
            ? <SequenceOutput sequence={sequence} isLoading={isLoading} />
            : <EmailOutput emails={emails} isLoading={isLoading} />
          }
        </div>
      </div>
    </div>
  );
}
