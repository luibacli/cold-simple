import { google } from "googleapis";
import type { Credentials } from "google-auth-library";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/userinfo.email",
];

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  );
}

export function getGmailAuthUrl() {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
}

export async function exchangeCodeForTokens(code: string): Promise<Credentials> {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function getGmailUserEmail(tokens: Credentials): Promise<string> {
  const client = getOAuth2Client();
  client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: "v2", auth: client });
  const { data } = await oauth2.userinfo.get();
  return data.email ?? "Unknown";
}

export async function sendGmail({
  tokens,
  to,
  subject,
  body,
}: {
  tokens: Credentials;
  to: string;
  subject: string;
  body: string;
}) {
  const client = getOAuth2Client();
  client.setCredentials(tokens);

  const gmail = google.gmail({ version: "v1", auth: client });

  const message = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`,
    "Content-Type: text/plain; charset=UTF-8",
    "MIME-Version: 1.0",
    "",
    body,
  ].join("\n");

  const encoded = Buffer.from(message).toString("base64url");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encoded },
  });
}
