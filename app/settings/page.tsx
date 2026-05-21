import Link from "next/link";
import { ConnectGmail } from "@/components/ConnectGmail";
import { ConnectMicrosoft } from "@/components/ConnectMicrosoft";
import { Zap, ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">ColdSimple</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        {/* --- Gmail --- */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-1">Gmail</h2>
          <p className="text-sm text-gray-500 mb-4">
            Connect your Google account to send cold emails from your Gmail inbox.
          </p>
          <ConnectGmail />
        </section>

        {/* --- Outlook / Microsoft --- */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-1">Outlook / Office 365</h2>
          <p className="text-sm text-gray-500 mb-4">
            Connect Outlook, Hotmail, or any Microsoft 365 account.
          </p>
          <ConnectMicrosoft />
        </section>

      </main>
    </div>
  );
}

