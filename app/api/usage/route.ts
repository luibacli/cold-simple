export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/supabase";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ used: 0, limit: 5, plan: "free" });

  const [{ data: profile }, { data: usage }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
    supabase
      .from("usage")
      .select("count")
      .eq("user_id", user.id)
      .eq("month", new Date().toISOString().slice(0, 7))
      .single(),
  ]);

  const plan = (profile?.plan ?? "free") as keyof typeof PLAN_LIMITS;
  const limit = PLAN_LIMITS[plan];

  return NextResponse.json({
    used: usage?.count ?? 0,
    limit: limit === Infinity ? null : limit,
    plan,
  });
}
