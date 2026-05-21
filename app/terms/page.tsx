import Link from "next/link";
import { Zap } from "lucide-react";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: May 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">1. Acceptance</h2>
            <p>By creating an account or using ColdSimple you agree to these terms. If you do not agree, do not use the service.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">2. The service</h2>
            <p>ColdSimple provides an AI-assisted tool for drafting cold outreach emails. The output is a starting point — you are responsible for reviewing, editing, and sending any emails you create. We do not guarantee specific reply rates or business outcomes.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">3. Acceptable use</h2>
            <p>You agree not to use ColdSimple to send spam, illegal content, or any communication that violates CAN-SPAM, GDPR, or applicable anti-spam laws. You are solely responsible for how you use the emails generated.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">4. Billing &amp; cancellation</h2>
            <p>Paid plans are billed monthly. You can cancel at any time from your account. Cancellation takes effect at the end of your current billing period — no partial refunds are issued. We reserve the right to change pricing with 30 days&apos; notice.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">5. Free plan limits</h2>
            <p>The free plan includes 5 email generations per calendar month. Limits reset on the 1st of each month. Free plan generations are not stored in email history.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">6. Intellectual property</h2>
            <p>You own the output generated through your use of ColdSimple. We retain ownership of the platform, code, and product.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">7. Limitation of liability</h2>
            <p>ColdSimple is provided &quot;as is.&quot; To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the service. Our total liability in any month is capped at the amount you paid us that month.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">8. Changes</h2>
            <p>We may update these terms. Continued use of the service after changes constitutes acceptance. Material changes will be communicated via email.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">9. Contact</h2>
            <p>Questions about these terms? Email <a href="mailto:support@coldsimple.app" className="text-indigo-600 hover:underline">support@coldsimple.app</a></p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800">← Back to ColdSimple</Link>
        </div>
      </main>
    </div>
  );
}
