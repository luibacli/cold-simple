"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Unlink } from "lucide-react";

type MicrosoftStatus = { connected: boolean; email?: string };

function OutlookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#0078D4" />
      <path d="M13 6h6v12h-6V6z" fill="#50a0e0" />
      <path d="M5 8.5A3.5 3.5 0 0 1 8.5 5h0A3.5 3.5 0 0 1 12 8.5v7A3.5 3.5 0 0 1 8.5 19h0A3.5 3.5 0 0 1 5 15.5v-7z" fill="white" />
      <text x="8.5" y="14" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#0078D4">O</text>
    </svg>
  );
}

export function ConnectMicrosoft() {
  const [status, setStatus] = useState<MicrosoftStatus | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/microsoft/status")
      .then((r) => r.json())
      .then(setStatus);
  }, []);

  const disconnect = async () => {
    setDisconnecting(true);
    await fetch("/api/auth/microsoft/disconnect", { method: "POST" });
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
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Outlook connected</p>
            <p className="text-xs text-blue-600">{status.email}</p>
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
          <OutlookIcon />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Connect Outlook</p>
          <p className="text-xs text-gray-500">Gmail, Outlook.com &amp; Office 365</p>
        </div>
      </div>
      <a href="/api/auth/microsoft">
        <Button size="sm" className="bg-[#0078D4] hover:bg-[#006CBE] text-white text-xs font-semibold">
          Connect →
        </Button>
      </a>
    </div>
  );
}
