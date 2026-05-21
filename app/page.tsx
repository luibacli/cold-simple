import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Target, Clock, TrendingUp, Star } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Generate in 10 seconds",
    desc: "Fill in your prospect details and get a battle-tested cold email instantly.",
  },
  {
    icon: Target,
    title: "Hyper-personalized",
    desc: "Every email is tailored to the prospect's role, industry, and specific pain points.",
  },
  {
    icon: TrendingUp,
    title: "Higher reply rates",
    desc: "Built on proven cold email frameworks used by top sales teams worldwide.",
  },
  {
    icon: Clock,
    title: "Multiple variants",
    desc: "A/B test different tones and angles to find what converts best for your audience.",
  },
];

const TESTIMONIALS = [
  {
    name: "Marcus T.",
    role: "Founder, B2B SaaS",
    body: "I went from spending 30 min per email to 30 seconds. My reply rate jumped from 3% to 11%.",
    stars: 5,
  },
  {
    name: "Sarah K.",
    role: "Sales Lead, Agency",
    body: "The direct tone option is fire. We booked 8 calls in the first week just from cold email.",
    stars: 5,
  },
  {
    name: "James R.",
    role: "Freelance Consultant",
    body: "Best $19 I spend every month. My pipeline literally doubled in 6 weeks.",
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
            <span className="font-bold text-gray-900 text-lg">MailBlitz</span>
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
          Powered by Claude AI
        </Badge>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
          Cold emails that actually{" "}
          <span className="text-indigo-600">get replies</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop staring at a blank page. Write hyper-personalized cold emails in 10 seconds — tailored to your
          prospect&apos;s pain points, role, and industry.
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
                Quick question about Acme Corp&apos;s outbound
              </p>
            </div>
            <div className="bg-white rounded-lg px-4 py-3 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Body</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Hey Alex,
                <br />
                <br />
                Noticed Acme Corp just expanded the sales team — congrats. Most heads of sales I talk to at that
                stage hit the same wall: more reps, but outbound still feels like a grind.
                <br />
                <br />
                We help B2B SaaS companies book 20+ demos/month using AI-assisted outbound — without a big SDR
                team.
                <br />
                <br />
                Worth a 15-min chat this week?
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
              Everything you need to win in the inbox
            </h2>
            <p className="text-gray-500">
              Built for founders, sales reps, and agencies who live and die by cold email.
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
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Loved by sales teams</h2>
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
            Start writing better cold emails today
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
            <span className="font-bold text-gray-700">MailBlitz</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 MailBlitz. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
