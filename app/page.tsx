import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Target, Clock, TrendingUp, Star } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Generate in 10 seconds",
    desc: "Fill in your prospect's details and get a battle-tested outreach email instantly.",
  },
  {
    icon: Target,
    title: "Built for real estate",
    desc: "Tailored for homeowners, investors, landlords, and referral partners — not generic sales copy.",
  },
  {
    icon: TrendingUp,
    title: "Win more listings",
    desc: "Built on proven outreach frameworks used by top-producing agents and real estate teams.",
  },
  {
    icon: Clock,
    title: "Every prospect type",
    desc: "Cold outreach, follow-ups, and LinkedIn DMs — for FSBOs, expired listings, and investors alike.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "Real Estate Agent, Miami",
    body: "I was spending 2 hours a day writing cold emails. Now it takes 15 minutes and my listing appointments doubled.",
    stars: 5,
  },
  {
    name: "Carlos R.",
    role: "Property Investor, Texas",
    body: "Used this to reach landlords directly. Closed 2 off-market deals in my first month. Insane ROI.",
    stars: 5,
  },
  {
    name: "Amanda T.",
    role: "Real Estate Team Lead",
    body: "My whole team uses this now. Our cold outreach reply rate went from 4% to 14% in 6 weeks.",
    stars: 5,
  },
];

function SparklesIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">ColdSimple</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="#features" className="hover:text-gray-900 transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-sm">Log in</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm gap-1.5">
                Try Free <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 mb-6 px-3 py-1 font-medium">
          Built for Real Estate Agents
        </Badge>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
          Cold emails that win{" "}
          <span className="text-indigo-600">real estate clients</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop losing listings to competitors. Write hyper-personalized cold emails to homeowners, investors,
          and referral partners in 10 seconds — powered by AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 h-12 gap-2 text-base"
            >
              <SparklesIcon />
              Generate Free Email
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base font-medium border-gray-200 text-gray-600 hover:text-gray-900"
            >
              See pricing
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">No credit card. 5 free emails/month.</p>

        {/* Demo Preview */}
        <div className="mt-16 bg-gray-50 border border-gray-200 rounded-2xl p-6 max-w-2xl mx-auto text-left shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-gray-400 ml-2">Generated in 8 seconds</span>
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">Subject</p>
              <p className="text-sm font-semibold text-gray-800">
                Quick question about 142 Maple St
              </p>
            </div>
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Body</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Hey Maria,
                <br />
                <br />
                Noticed 142 Maple St has been on the market for 52 days. Homes in that zip are moving in under
                18 days right now — so something&apos;s off with the positioning.
                <br />
                <br />
                I&apos;ve helped 3 homeowners on your street sell above asking this quarter. Usually comes down
                to one or two small fixes.
                <br />
                <br />
                Worth a 10-min chat to see if I can get you a better outcome?
                <br />
                <br />— Jordan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Everything you need to win more listings
            </h2>
            <p className="text-gray-500">
              Built for real estate agents, investors, and teams who grow their business through cold outreach.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Loved by real estate pros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">&ldquo;{t.body}&rdquo;</p>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start winning more listings today
          </h2>
          <p className="text-indigo-200 mb-8">5 free emails every month. No credit card required.</p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-10 h-12 text-base gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-700">ColdSimple</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 ColdSimple. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
