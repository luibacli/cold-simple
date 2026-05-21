export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const plan = session.metadata?.plan;
      if (userId && plan) {
        await supabase.from("profiles").update({
          plan,
          subscription_id: session.subscription as string,
          subscription_status: "active",
        }).eq("id", userId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", sub.customer as string)
        .single();
      if (profile) {
        await supabase.from("profiles").update({
          subscription_status: sub.status,
        }).eq("id", profile.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", sub.customer as string)
        .single();
      if (profile) {
        await supabase.from("profiles").update({
          plan: "free",
          subscription_id: null,
          subscription_status: "cancelled",
        }).eq("id", profile.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
