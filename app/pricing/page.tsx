import Link from "next/link";
import { PricingCard } from "@/components/PricingCard";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Button } from "@/components/ui/button";
import { Zap, Check } from "lucide-react";

const FREE_FEATURES = [
  "5 emails per month",
  "1 variant per generation",
  "Cold outreach & follow-up",
  "All 4 tones",
  "Copy to clipboard",
];

const PRO_FEATURES = [
  "Unlimited cold emails",
  "Up to 3 variants per generation",
  "Cold, follow-up & LinkedIn DM",
  "All 4 tones",
  "Email history (30 days)",
  "Priority generation speed",
];

const TEAM_FEATURES = [
  "Everything in Pro",
  "Bulk CSV up to 100 prospects",
  "3-email sequences included",
  "Gmail & Outlook send integration",
  "Priority support via email",
  "Early access to new features",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">ColdSimple</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-sm">Log in</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm">
                Try Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-4xl mx-auto">
          {/* Free */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">Free</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-sm text-gray-400 mb-2">/month</span>
              </div>
            </div>
            <ul className="space-y-3 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-600">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full h-11 font-semibold border-gray-200 text-gray-700 hover:bg-gray-50">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Pro */}
          <PricingCard
            name="Pro"
            price={19}
            features={PRO_FEATURES}
            highlight
            badge="Most Popular"
            customCta={<CheckoutButton plan="pro" label="Start Pro — $19/mo" highlight />}
          />

          {/* Team */}
          <PricingCard
            name="Team"
            price={49}
            features={TEAM_FEATURES}
            customCta={<CheckoutButton plan="team" label="Start Team — $49/mo" />}
          />
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">FAQ</h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel from your account dashboard. You keep access until the end of your billing period.",
              },
              {
                q: "What counts as one email?",
                a: "Each time you click Generate counts as one use, regardless of how many variants you generate.",
              },
              {
                q: "Do you store my generated emails?",
                a: "Pro and Team plans get 30-day email history. Free plan emails are not stored after the session.",
              },
              {
                q: "Is the AI actually good?",
                a: "We use Claude AI by Anthropic — one of the most capable language models available. Results are consistently better than GPT-4 for sales copy.",
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
