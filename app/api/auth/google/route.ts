import { NextResponse } from "next/server";
import { getGmailAuthUrl } from "@/lib/google";

export async function GET() {
  const url = getGmailAuthUrl();
  return NextResponse.redirect(url);
}
