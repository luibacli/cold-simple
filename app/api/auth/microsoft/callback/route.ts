import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeMicrosoftCode, getMicrosoftUserEmail } from "@/lib/microsoft";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/settings?error=microsoft_denied`);
  }

  try {
    const tokens = await exchangeMicrosoftCode(code);
    const email = await getMicrosoftUserEmail(tokens.access_token);

    const cookieStore = await cookies();
    cookieStore.set(
      "microsoft_tokens",
      JSON.stringify({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        email,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      }
    );

    return NextResponse.redirect(`${appUrl}/settings?connected=microsoft`);
  } catch (err) {
    console.error("Microsoft OAuth error:", err);
    return NextResponse.redirect(`${appUrl}/settings?error=microsoft_failed`);
  }
}
