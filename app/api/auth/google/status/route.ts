export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("gmail_tokens");

  if (!raw) return NextResponse.json({ connected: false });

  try {
    const { email } = JSON.parse(raw.value);
    return NextResponse.json({ connected: true, email });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
