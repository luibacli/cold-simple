export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sendGmail } from "@/lib/google";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("gmail_tokens");

  if (!raw) {
    return NextResponse.json({ error: "Gmail not connected" }, { status: 401 });
  }

  const { to, subject, body } = await req.json();

  if (!to || !subject || !body) {
    return NextResponse.json({ error: "Missing to, subject, or body" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    const tokens = JSON.parse(raw.value);
    await sendGmail({ tokens, to, subject, body });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send error:", err);
    return NextResponse.json({ error: "Failed to send. Check your Gmail connection." }, { status: 500 });
  }
}
