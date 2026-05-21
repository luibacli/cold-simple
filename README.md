# MailBlitz

AI-powered cold email writer SaaS. Generate hyper-personalized cold emails, follow-up sequences, and bulk outreach campaigns in seconds — powered by Claude AI.

**Stack:** Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui · Supabase · Stripe · Claude Haiku

---

## Features

- **Single email** — generate cold, follow-up, or LinkedIn DM variants with 4 tone options
- **3-email sequence** — Day 0 / Day 3 / Day 7 outreach sequence
- **Bulk CSV** — upload a prospect list and generate personalized emails for all of them (Pro/Team)
- **Gmail & Outlook send** — OAuth integration to send directly from your inbox
- **Usage tracking** — per-plan monthly limits enforced server-side
- **Stripe billing** — Free / Pro ($19/mo) / Team ($49/mo) with webhook-synced plan state
- **Email history** — 30-day history on paid plans

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/your-username/mailblitz.git
cd mailblitz
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local` — only the first three sections (Anthropic, Supabase, Stripe) are required to run the core product. Upstash, OAuth, and Sentry are optional.

### 3. Supabase database

In your Supabase project, open the **SQL editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql). This creates the `profiles`, `usage`, and `email_history` tables, RLS policies, and helper functions.

### 4. Stripe products

Create two recurring products in Stripe:
- **Pro** — $19/month
- **Team** — $49/month

Copy each price ID into `STRIPE_PRO_PRICE_ID` and `STRIPE_TEAM_PRICE_ID` in `.env.local`.

For local webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.local.example` (set `NEXT_PUBLIC_APP_URL` to your production domain)
4. In Stripe, add your production URL as a webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
5. In Supabase → Auth → URL Configuration, add your production URL to **Redirect URLs**

---

## Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-only) |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `STRIPE_PRO_PRICE_ID` | Yes | Stripe price ID for Pro plan |
| `STRIPE_TEAM_PRICE_ID` | Yes | Stripe price ID for Team plan |
| `UPSTASH_REDIS_REST_URL` | No | Rate limiting (disabled if unset) |
| `UPSTASH_REDIS_REST_TOKEN` | No | Rate limiting (disabled if unset) |
| `GOOGLE_CLIENT_ID` | No | Gmail OAuth integration |
| `GOOGLE_CLIENT_SECRET` | No | Gmail OAuth integration |
| `MICROSOFT_CLIENT_ID` | No | Outlook OAuth integration |
| `MICROSOFT_CLIENT_SECRET` | No | Outlook OAuth integration |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry error monitoring (client) |
| `SENTRY_DSN` | No | Sentry error monitoring (server) |
| `NEXT_PUBLIC_APP_URL` | Yes | Full base URL (e.g. `https://mailblitz.app`) |

---

## Project structure

```
app/
  api/          — API routes (generate, bulk, stripe, auth)
  auth/         — Login, signup, reset password pages
  dashboard/    — Main generator UI
  history/      — Email history page
  pricing/      — Pricing + checkout
  settings/     — Gmail / Outlook connect
  privacy/      — Privacy policy
  terms/        — Terms of service
components/
  EmailGenerator.tsx   — Single email + sequence generator
  BulkGenerator.tsx    — CSV bulk upload generator
  DashboardTabs.tsx    — Tab switcher (single / sequence / bulk)
lib/
  claude.ts     — Claude API calls
  stripe.ts     — Stripe client + plan config
  supabase/     — Supabase server + client helpers
  ratelimit.ts  — Upstash rate limiting
supabase/
  schema.sql    — Full DB schema (run once in Supabase SQL editor)
```
