export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { generateColdEmail, EmailGeneratorInput } from "@/lib/claude";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in to generate emails." }, { status: 401 });
  }

  // Rate limit: 10 generations/min per user
  const rl = await checkRateLimit("generate", user.id);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Please wait ${rl.retryAfter}s before trying again.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as keyof typeof PLAN_LIMITS;
  const limit = PLAN_LIMITS[plan];
  const month = new Date().toISOString().slice(0, 7);

  if (limit !== Infinity) {
    const { data: usage } = await supabase
      .from("usage")
      .select("count")
      .eq("user_id", user.id)
      .eq("month", month)
      .single();

    if ((usage?.count ?? 0) >= limit) {
      return NextResponse.json(
        { error: `You've used all ${limit} free emails this month. Upgrade to Pro for unlimited.`, limitReached: true },
        { status: 429 }
      );
    }
  }

  const body: EmailGeneratorInput = await req.json();
  const required = ["prospectName", "prospectCompany", "prospectRole", "industry", "painPoint", "yourOffer", "yourName", "cta"];
  for (const field of required) {
    if (!body[field as keyof EmailGeneratorInput]) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  try {
    const emails = await generateColdEmail(body);

    await Promise.all([
      supabase.from("email_history").insert({
        user_id: user.id,
        type: "single",
        prospect_name: body.prospectName,
        prospect_company: body.prospectCompany,
        tone: body.tone,
        subject: emails[0].subject,
        body: emails[0].body,
      }),
      limit !== Infinity
        ? supabase.rpc("increment_usage", { p_user_id: user.id, p_month: month })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ emails });
  } catch (err) {
    Sentry.captureException(err, { extra: { userId: user.id } });
    return NextResponse.json({ error: "Failed to generate email. Check your API key." }, { status: 500 });
  }
}
