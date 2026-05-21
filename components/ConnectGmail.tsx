"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Loader2, Unlink } from "lucide-react";

type GmailStatus = { connected: boolean; email?: string };

export function ConnectGmail() {
  const [status, setStatus] = useState<GmailStatus | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/google/status")
      .then((r) => r.json())
      .then(setStatus);
  }, []);

  const disconnect = async () => {
    setDisconnecting(true);
    await fetch("/api/auth/google/disconnect", { method: "POST" });
    setStatus({ connected: false });
    setDisconnecting(false);
  };

  if (!status) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Checking connection...
      </div>
    );
  }

  if (status.connected) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Gmail connected</p>
            <p className="text-xs text-green-600">{status.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnect}
          disabled={disconnecting}
          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 gap-1.5"
        >
          <Unlink className="w-3.5 h-3.5" />
          {disconnecting ? "Disconnecting..." : "Disconnect"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
          <Mail className="w-4 h-4 text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Connect Gmail</p>
          <p className="text-xs text-gray-500">Send emails directly from your inbox</p>
        </div>
      </div>
      <a href="/api/auth/google">
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
          Connect →
        </Button>
      </a>
    </div>
  );
}
