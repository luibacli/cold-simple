export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sendOutlookEmail } from "@/lib/microsoft";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("microsoft_tokens");

  if (!raw) {
    return NextResponse.json({ error: "Outlook not connected" }, { status: 401 });
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
    const { newAccessToken } = await sendOutlookEmail({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      to,
      subject,
      body,
    });

    // Persist refreshed token if it changed
    if (newAccessToken) {
      cookieStore.set(
        "microsoft_tokens",
        JSON.stringify({ ...tokens, access_token: newAccessToken }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Outlook send error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send via Outlook" },
      { status: 500 }
    );
  }
}
