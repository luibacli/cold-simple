import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-04-22.dahlia",
    });
  }
  return _stripe;
}

// Named export alias so existing imports still work
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PLANS = {
  pro: {
    name: "Pro",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      "Unlimited cold emails",
      "Up to 3 variants per generation",
      "Follow-up sequences",
      "Email history (30 days)",
      "All tones & email types",
    ],
  },
  team: {
    name: "Team",
    price: 49,
    priceId: process.env.STRIPE_TEAM_PRICE_ID!,
    features: [
      "Everything in Pro",
      "3 team seats",
      "Brand voice customization",
      "Shared team templates",
      "Priority support",
    ],
  },
};
