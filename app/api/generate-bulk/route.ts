export const dynamic = "force-dynamic";
import { NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { generateColdEmail } from "@/lib/claude";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/ratelimit";

const PLAN_ROW_LIMITS: Record<string, number> = {
  free: 0,
  pro: 20,
  team: 100,
};

export interface BulkProspect {
  name: string;
  company: string;
  role: string;
  industry: string;
  pain_point: string;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const rl = await checkRateLimit("bulk", user.id);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: `Too many bulk requests. Try again in ${rl.retryAfter}s.` }),
      { status: 429 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan ?? "free";
  const rowLimit = PLAN_ROW_LIMITS[plan] ?? 0;

  if (rowLimit === 0) {
    return new Response(
      JSON.stringify({ error: "Bulk generation requires a Pro or Team plan." }),
      { status: 403 }
    );
  }

  const { prospects, yourName, yourOffer, cta, tone } = await req.json();

  if (!Array.isArray(prospects) || prospects.length === 0) {
    return new Response(JSON.stringify({ error: "No prospects provided." }), { status: 400 });
  }

  const rows = prospects.slice(0, rowLimit) as BulkProspect[];
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      send({ type: "start", total: rows.length });

      for (let i = 0; i < rows.length; i++) {
        const p = rows[i];
        try {
          const emails = await generateColdEmail({
            prospectName: p.name,
            prospectCompany: p.company,
            prospectRole: p.role,
            industry: p.industry,
            painPoint: p.pain_point,
            yourName,
            yourOffer,
            cta,
            tone: tone ?? "professional",
            emailType: "cold",
            variants: 1,
          });
          send({ type: "result", index: i, prospect: p, email: emails[0] });
        } catch (err) {
          Sentry.captureException(err);
          send({ type: "result", index: i, prospect: p, email: null, error: "Failed" });
        }
      }

      send({ type: "done" });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
