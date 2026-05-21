import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface EmailGeneratorInput {
  prospectName: string;
  prospectCompany: string;
  prospectRole: string;
  industry: string;
  painPoint: string;
  yourOffer: string;
  yourName: string;
  cta: string;
  tone: "professional" | "casual" | "direct" | "story";
  emailType: "cold" | "followup" | "linkedin";
  variants: number;
}

const TONE_DESCRIPTIONS = {
  professional: "formal, polished, and business-appropriate",
  casual: "friendly, conversational, and approachable",
  direct: "concise, no-fluff, straight to the value proposition",
  story: "narrative-driven, opening with a relatable story or observation",
};

const EMAIL_TYPE_DESCRIPTIONS = {
  cold: "first-touch cold outreach email",
  followup: "follow-up email to a previous cold email (assume no reply yet)",
  linkedin: "LinkedIn direct message (keep it under 300 characters, very casual)",
};

export async function generateColdEmail(input: EmailGeneratorInput) {
  const toneDesc = TONE_DESCRIPTIONS[input.tone];
  const typeDesc = EMAIL_TYPE_DESCRIPTIONS[input.emailType];

  const prompt = `You are an expert cold email copywriter who writes emails with high reply rates.

Generate ${input.variants} distinct ${typeDesc} variant(s) with a ${toneDesc} tone.

PROSPECT INFO:
- Name: ${input.prospectName}
- Company: ${input.prospectCompany}
- Role: ${input.prospectRole}
- Industry: ${input.industry}
- Pain Point / Challenge: ${input.painPoint}

SENDER INFO:
- Your Name: ${input.yourName}
- Your Offer: ${input.yourOffer}
- Call to Action: ${input.cta}

RULES:
- Subject line must create curiosity or speak directly to their pain
- Opening line must NOT start with "I" or "My name is"
- Body must be under 150 words (except LinkedIn which should be under 300 chars)
- One clear CTA only
- No fluff, no generic lines like "I hope this finds you well"
- Make it feel human, not AI-generated
- Personalize based on their role and industry

OUTPUT FORMAT (for each variant):
---VARIANT [number]---
Subject: [subject line]

[email body]

---END---

Generate exactly ${input.variants} variant(s). Nothing else, no explanations.`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  return parseEmailVariants(content.text);
}

export interface SequenceEmail {
  subject: string;
  body: string;
  day: number;
  label: string;
}

export async function generateEmailSequence(input: EmailGeneratorInput): Promise<SequenceEmail[]> {
  const toneDesc = TONE_DESCRIPTIONS[input.tone];

  const prompt = `You are an expert cold email copywriter. Write a 3-email cold outreach sequence with a ${toneDesc} tone.

PROSPECT INFO:
- Name: ${input.prospectName}
- Company: ${input.prospectCompany}
- Role: ${input.prospectRole}
- Industry: ${input.industry}
- Pain Point: ${input.painPoint}

SENDER INFO:
- Your Name: ${input.yourName}
- Your Offer: ${input.yourOffer}
- Call to Action: ${input.cta}

SEQUENCE STRUCTURE:
Email 1 (Day 0) — Cold Outreach: First touch. Personalized hook, clear value prop, soft CTA.
Email 2 (Day 3) — Follow-Up: Short, references Email 1, adds one new insight or social proof. Different angle.
Email 3 (Day 7) — Break-Up: Final attempt. Low pressure. Make them feel they're losing something.

RULES FOR ALL EMAILS:
- Never start with "I" or "My name is"
- Under 120 words each
- No "I hope this finds you well"
- Each email must feel distinct — not just a copy-paste with minor changes
- Human, not AI-generated sounding

OUTPUT FORMAT (exactly this, nothing else):
---EMAIL 1---
Subject: [subject]

[body]
---END---

---EMAIL 2---
Subject: [subject]

[body]
---END---

---EMAIL 3---
Subject: [subject]

[body]
---END---`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  return parseSequence(content.text);
}

const SEQUENCE_META = [
  { day: 0, label: "Cold Outreach" },
  { day: 3, label: "Follow-Up" },
  { day: 7, label: "Break-Up" },
];

function parseSequence(raw: string): SequenceEmail[] {
  const emails: SequenceEmail[] = [];
  const blocks = raw.split(/---EMAIL \d+---/).filter((b) => b.trim());

  for (let i = 0; i < Math.min(blocks.length, 3); i++) {
    const cleaned = blocks[i].replace(/---END---/g, "").trim();
    const subjectMatch = cleaned.match(/Subject:\s*(.+)/);
    const subject = subjectMatch ? subjectMatch[1].trim() : `Email ${i + 1}`;
    const body = cleaned.replace(/Subject:\s*.+/, "").trim();
    if (body) {
      emails.push({ subject, body, ...SEQUENCE_META[i] });
    }
  }

  return emails;
}

function parseEmailVariants(raw: string): Array<{ subject: string; body: string }> {
  const variants: Array<{ subject: string; body: string }> = [];
  const blocks = raw.split(/---VARIANT \d+---/).filter((b) => b.trim());

  for (const block of blocks) {
    const cleaned = block.replace(/---END---/g, "").trim();
    const subjectMatch = cleaned.match(/Subject:\s*(.+)/);
    const subject = subjectMatch ? subjectMatch[1].trim() : "Cold Email";
    const body = cleaned.replace(/Subject:\s*.+/, "").trim();
    if (body) variants.push({ subject, body });
  }

  return variants.length > 0 ? variants : [{ subject: "Follow Up", body: raw }];
}
