import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens, getGmailUserEmail } from "@/lib/google";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/settings?error=gmail_denied`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const email = await getGmailUserEmail(tokens);

    const cookieStore = await cookies();
    cookieStore.set("gmail_tokens", JSON.stringify({ ...tokens, email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.redirect(`${appUrl}/settings?connected=true`);
  } catch (err) {
    console.error("Gmail OAuth error:", err);
    return NextResponse.redirect(`${appUrl}/settings?error=gmail_failed`);
  }
}
