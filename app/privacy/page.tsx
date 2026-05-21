import Link from "next/link";
import { Zap } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">ColdSimple</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: May 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">1. What we collect</h2>
            <p>When you create an account we collect your email address and a hashed password. When you generate emails we store the prospect details and generated output so you can access your history. We collect basic usage data (how many emails you&apos;ve generated this month) to enforce plan limits.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">2. How we use it</h2>
            <p>We use your email to send account-related messages (confirmation, password reset, billing receipts). We do not send marketing emails without explicit opt-in. We use usage data solely to enforce your plan limits and improve the service.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">3. Third-party services</h2>
            <p>We use the following sub-processors:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Supabase</strong> — database and authentication (EU region)</li>
              <li><strong>Stripe</strong> — payment processing (we never see your full card number)</li>
              <li><strong>Anthropic</strong> — AI email generation (your inputs are sent to Anthropic&apos;s API; they are not used to train models per their API policy)</li>
              <li><strong>Sentry</strong> — error monitoring (anonymized stack traces only)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">4. Data retention</h2>
            <p>Email history is retained for 30 days on paid plans and is not stored on the free plan beyond the current session. You can delete your account and all associated data at any time by emailing us.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">5. Your rights</h2>
            <p>You have the right to access, correct, or delete your personal data. To exercise these rights, email us at the address below.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">6. Contact</h2>
            <p>Questions? Email us at <a href="mailto:support@coldsimple.app" className="text-indigo-600 hover:underline">support@coldsimple.app</a></p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800">← Back to ColdSimple</Link>
        </div>
      </main>
    </div>
  );
}
