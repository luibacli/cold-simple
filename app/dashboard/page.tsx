import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardTabs } from "@/components/DashboardTabs";
import { AccountMenu } from "@/components/AccountMenu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { Zap, LayoutDashboard, Settings, PartyPopper, History } from "lucide-react";

interface Props {
  searchParams: Promise<{ upgraded?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan ?? "free";
  const params = await searchParams;
  const justUpgraded = params.upgraded === "true";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">MailBlitz</span>
            </Link>
            <span className="text-gray-300 text-sm">/</span>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {plan === "free" && (
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  Upgrade to Pro
                </Button>
              </Link>
            )}
            <Link href="/history">
              <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-800 gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">History</span>
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-800 gap-1.5">
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
            <AccountMenu email={user.email!} plan={plan} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {justUpgraded && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <PartyPopper className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">You&apos;re on Pro!</p>
              <p className="text-xs text-green-600">Unlimited emails + all features unlocked.</p>
            </div>
            <Badge className="ml-auto bg-green-600 text-white">PRO</Badge>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Cold Email Generator</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details below and get a personalized cold email in seconds.
          </p>
        </div>

        <DashboardTabs plan={plan} />
      </main>
    </div>
  );
}
