"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface SendEmailButtonProps {
  subject: string;
  body: string;
}

type Provider = "gmail" | "outlook";
type SendStatus = "idle" | "sending" | "sent" | "error";

interface ProviderStatus {
  gmail: { connected: boolean; email?: string };
  outlook: { connected: boolean; email?: string };
}

function GmailIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

function OutlookIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V10.85l1.24.72q.06.04.1.2z" />
    </svg>
  );
}

export function SendEmailButton({ subject, body }: SendEmailButtonProps) {
  const [providers, setProviders] = useState<ProviderStatus | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [to, setTo] = useState("");
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/google/status").then((r) => r.json()),
      fetch("/api/auth/microsoft/status").then((r) => r.json()),
    ]).then(([gmail, outlook]) => {
      setProviders({ gmail, outlook });
      // Auto-select if only one is connected
      if (gmail.connected && !outlook.connected) setSelectedProvider("gmail");
      if (outlook.connected && !gmail.connected) setSelectedProvider("outlook");
      if (gmail.connected && outlook.connected) setSelectedProvider("gmail");
    });
  }, []);

  const handleSend = async () => {
    if (!to || !selectedProvider) return;
    setSendStatus("sending");
    setError("");

    const endpoint = selectedProvider === "gmail" ? "/api/send" : "/api/send-outlook";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSendStatus("sent");
      setTo("");
      setTimeout(() => setSendStatus("idle"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
      setSendStatus("error");
    }
  };

  if (!providers) return null;

  const noneConnected = !providers.gmail.connected && !providers.outlook.connected;
  const bothConnected = providers.gmail.connected && providers.outlook.connected;

  if (noneConnected) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-400">Send directly from your inbox?</p>
        <a href="/settings" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          Connect Gmail or Outlook →
        </a>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Send via</p>

        {/* Provider toggle — only shown when both are connected */}
        {bothConnected && (
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setSelectedProvider("gmail")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedProvider === "gmail"
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <GmailIcon />
              Gmail
            </button>
            <button
              onClick={() => setSelectedProvider("outlook")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedProvider === "outlook"
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <OutlookIcon />
              Outlook
            </button>
          </div>
        )}

        {/* Single provider badge */}
        {!bothConnected && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            {selectedProvider === "gmail" ? <GmailIcon /> : <OutlookIcon />}
            <span className="font-medium capitalize">{selectedProvider}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="prospect@company.com"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="h-9 text-sm flex-1"
          disabled={sendStatus === "sending" || sendStatus === "sent"}
        />
        <Button
          onClick={handleSend}
          disabled={!to || sendStatus === "sending" || sendStatus === "sent"}
          className={`h-9 gap-1.5 font-semibold text-sm shrink-0 text-white ${
            sendStatus === "sent"
              ? "bg-green-600 hover:bg-green-600"
              : selectedProvider === "outlook"
              ? "bg-[#0078D4] hover:bg-[#006CBE]"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {sendStatus === "sending" ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
          ) : sendStatus === "sent" ? (
            <><CheckCircle className="w-3.5 h-3.5" /> Sent!</>
          ) : (
            <><Send className="w-3.5 h-3.5" /> Send</>
          )}
        </Button>
      </div>

      {sendStatus === "error" && (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}
