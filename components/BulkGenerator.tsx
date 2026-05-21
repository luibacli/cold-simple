"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Upload, Download, ChevronDown, ChevronUp, Check, Copy, Loader2, FileText, Sparkles } from "lucide-react";
import type { BulkProspect } from "@/app/api/generate-bulk/route";

interface ResultRow {
  prospect: BulkProspect;
  email: { subject: string; body: string } | null;
  error?: string;
}

function splitCSVLine(line: string): string[] {
  const fields: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      fields.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur.trim());
  return fields;
}

function parseCSV(text: string): BulkProspect[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const required = ["name", "company", "role", "industry", "pain_point"];
  if (!required.every((r) => headers.includes(r))) return [];

  return lines.slice(1).map((line) => {
    const vals = splitCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = vals[i] ?? ""));
    return {
      name: row.name,
      company: row.company,
      role: row.role,
      industry: row.industry,
      pain_point: row.pain_point,
    };
  }).filter((r) => r.name && r.company);
}

function toCsvRow(row: ResultRow): string {
  const e = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  return [
    e(row.prospect.name),
    e(row.prospect.company),
    e(row.prospect.role),
    e(row.prospect.industry),
    e(row.prospect.pain_point),
    e(row.email?.subject ?? ""),
    e(row.email?.body ?? row.error ?? ""),
  ].join(",");
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-xs text-gray-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

interface Props {
  plan: string;
}

export function BulkGenerator({ plan }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [prospects, setProspects] = useState<BulkProspect[]>([]);
  const [parseError, setParseError] = useState("");
  const [yourName, setYourName] = useState("");
  const [yourOffer, setYourOffer] = useState("");
  const [cta, setCta] = useState("");
  const [tone, setTone] = useState("professional");
  const [results, setResults] = useState<ResultRow[]>([]);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const planLimit = plan === "team" ? 100 : plan === "pro" ? 20 : 0;

  const handleFile = (file: File) => {
    setParseError("");
    setProspects([]);
    setResults([]);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length === 0) {
        setParseError("Could not parse CSV. Make sure it has columns: name, company, role, industry, pain_point");
      } else {
        setProspects(rows.slice(0, planLimit));
      }
    };
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    if (!prospects.length || !yourName || !yourOffer || !cta) return;
    setRunning(true);
    setError("");
    setResults([]);
    setProgress(0);

    try {
      const res = await fetch("/api/generate-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospects, yourName, yourOffer, cta, tone }),
      });

      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to start generation");
        setRunning(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n\n");
        buf = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = JSON.parse(line.slice(5).trim());

          if (data.type === "start") setTotal(data.total);
          if (data.type === "result") {
            setResults((prev) => [...prev, { prospect: data.prospect, email: data.email, error: data.error }]);
            setProgress((p) => p + 1);
          }
          if (data.type === "done") setRunning(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setRunning(false);
    }
  };

  const downloadCSV = () => {
    const header = "name,company,role,industry,pain_point,subject,body";
    const rows = results.map(toCsvRow).join("\n");
    const blob = new Blob([`${header}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mailblitz-bulk-emails.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    const csv = "name,company,role,industry,pain_point\nAlex,Acme Corp,Head of Sales,SaaS,Struggling to scale outbound without growing headcount\nSarah,TechCo,VP Marketing,E-commerce,Low email open rates on campaigns";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mailblitz-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isReady = prospects.length > 0 && yourName && yourOffer && cta;

  return (
    <div className="space-y-6">
      {/* Step 1 — Upload */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Step 1 — Upload Prospects</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              CSV with columns: <code className="bg-gray-100 px-1 rounded">name, company, role, industry, pain_point</code>
            </p>
          </div>
          <button onClick={downloadTemplate} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
            <Download className="w-3.5 h-3.5" />
            Download template
          </button>
        </div>

        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 font-medium">Drop your CSV here or click to upload</p>
          <p className="text-xs text-gray-400 mt-1">Up to {planLimit} rows on {plan} plan</p>
        </div>

        {parseError && (
          <p className="mt-3 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{parseError}</p>
        )}

        {prospects.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-600">{prospects.length} prospect{prospects.length !== 1 ? "s" : ""} loaded</p>
              <Badge variant="secondary" className="text-xs">{plan} plan · max {planLimit}</Badge>
            </div>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Name", "Company", "Role", "Industry", "Pain Point"].map((h) => (
                      <th key={h} className="text-left px-3 py-2 font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prospects.slice(0, 5).map((p, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="px-3 py-2 font-medium text-gray-800">{p.name}</td>
                      <td className="px-3 py-2 text-gray-600">{p.company}</td>
                      <td className="px-3 py-2 text-gray-600">{p.role}</td>
                      <td className="px-3 py-2 text-gray-600">{p.industry}</td>
                      <td className="px-3 py-2 text-gray-500 truncate max-w-32">{p.pain_point}</td>
                    </tr>
                  ))}
                  {prospects.length > 5 && (
                    <tr><td colSpan={5} className="px-3 py-2 text-gray-400 text-center">+{prospects.length - 5} more rows</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Step 2 — Sender details */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Step 2 — Your Details (applied to all emails)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Your Name</Label>
            <Input placeholder="Jordan" value={yourName} onChange={(e) => setYourName(e.target.value)} className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Tone</Label>
            <Select value={tone} onValueChange={(v) => v && setTone(v)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
                <SelectItem value="story">Story</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Your Offer</Label>
            <Textarea placeholder="We help B2B SaaS companies book 20+ demos/month using AI-powered outbound" value={yourOffer} onChange={(e) => setYourOffer(e.target.value)} className="text-sm resize-none h-16" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Call to Action</Label>
            <Input placeholder="Book a 15-min call this week" value={cta} onChange={(e) => setCta(e.target.value)} className="h-9 text-sm" />
          </div>
        </div>
      </div>

      {/* Generate button + progress */}
      <div className="space-y-3">
        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
        )}

        {running && total > 0 && (
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Generating emails...</span>
              <span className="text-xs text-gray-400">{progress} / {total}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${total > 0 ? (progress / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={!isReady || running}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 gap-2"
          >
            {running ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating {progress}/{total}...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generate {prospects.length > 0 ? `${prospects.length} ` : ""}Emails</>
            )}
          </Button>

          {results.length > 0 && !running && (
            <Button onClick={downloadCSV} variant="outline" className="gap-2 h-11 border-indigo-200 text-indigo-600 hover:bg-indigo-50">
              <Download className="w-4 h-4" />
              Download CSV
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">
              {results.length} email{results.length !== 1 ? "s" : ""} generated
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" />{results.filter((r) => r.email).length} succeeded</span>
              {results.filter((r) => r.error).length > 0 && (
                <span className="text-red-400">{results.filter((r) => r.error).length} failed</span>
              )}
            </div>
          </div>

          {results.map((row, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${row.email ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                  {row.email ? <Check className="w-3.5 h-3.5" /> : "!"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{row.prospect.name} — {row.prospect.company}</p>
                  {row.email && <p className="text-xs text-gray-400 truncate">{row.email.subject}</p>}
                  {row.error && <p className="text-xs text-red-400">Generation failed</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {row.email && <CopyBtn text={`Subject: ${row.email.subject}\n\n${row.email.body}`} />}
                  {expanded === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
              {expanded === i && row.email && (
                <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Subject</p>
                    <p className="text-sm font-semibold text-gray-800">{row.email.subject}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Body</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{row.email.body}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Re-export for the API route type
export type { BulkProspect };
