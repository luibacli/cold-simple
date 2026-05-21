import Link from "next/link";
import { ConnectGmail } from "@/components/ConnectGmail";
import { ConnectMicrosoft } from "@/components/ConnectMicrosoft";
import { Zap, ArrowLeft, Info } from "lucide-react";

export default function SettingsPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
  const gmailCallback = `${appUrl}/api/auth/google/callback`;
  const microsoftCallback = `${appUrl}/api/auth/microsoft/callback`;

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

        {/* Gmail Setup Guide */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-indigo-500 shrink-0" />
            <h2 className="text-sm font-semibold text-gray-800">Gmail — Google Cloud Setup</h2>
          </div>
          <ol className="space-y-3.5 text-sm text-gray-600">
            <SetupStep n={1}>
              Go to <b>console.cloud.google.com</b> → Create a new project
            </SetupStep>
            <SetupStep n={2}>
              Enable the <b>Gmail API</b> from APIs &amp; Services → Library
            </SetupStep>
            <SetupStep n={3}>
              Go to <b>APIs &amp; Services → Credentials</b> → Create OAuth 2.0 Client ID (Web application)
            </SetupStep>
            <SetupStep n={4}>
              Add this authorized redirect URI:
              <CodeBlock>{gmailCallback}</CodeBlock>
            </SetupStep>
            <SetupStep n={5}>
              Add to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env.local</code>:
              <CodeBlock>{`GOOGLE_CLIENT_ID=your_client_id\nGOOGLE_CLIENT_SECRET=your_client_secret`}</CodeBlock>
            </SetupStep>
          </ol>
        </section>

        {/* --- Outlook / Microsoft --- */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-1">Outlook / Office 365</h2>
          <p className="text-sm text-gray-500 mb-4">
            Connect Outlook, Hotmail, or any Microsoft 365 account.
          </p>
          <ConnectMicrosoft />
        </section>

        {/* Microsoft Setup Guide */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
            <h2 className="text-sm font-semibold text-gray-800">Outlook — Azure App Setup</h2>
          </div>
          <ol className="space-y-3.5 text-sm text-gray-600">
            <SetupStep n={1}>
              Go to <b>portal.azure.com</b> → Azure Active Directory → App registrations → New registration
            </SetupStep>
            <SetupStep n={2}>
              Set <b>Supported account types</b> to{" "}
              <em>Accounts in any organizational directory and personal Microsoft accounts</em>
            </SetupStep>
            <SetupStep n={3}>
              Under <b>Authentication</b>, add this redirect URI (type: Web):
              <CodeBlock>{microsoftCallback}</CodeBlock>
            </SetupStep>
            <SetupStep n={4}>
              Under <b>API permissions</b>, add: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">Mail.Send</code>{" "}
              and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">User.Read</code> (both Delegated)
            </SetupStep>
            <SetupStep n={5}>
              Under <b>Certificates &amp; secrets</b>, create a new client secret
            </SetupStep>
            <SetupStep n={6}>
              Add to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env.local</code>:
              <CodeBlock>{`MICROSOFT_CLIENT_ID=your_application_id\nMICROSOFT_CLIENT_SECRET=your_client_secret_value`}</CodeBlock>
            </SetupStep>
          </ol>
        </section>
      </main>
    </div>
  );
}

function SetupStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
        {n}
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <code className="block mt-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-indigo-700 font-mono break-all whitespace-pre">
      {children}
    </code>
  );
}
