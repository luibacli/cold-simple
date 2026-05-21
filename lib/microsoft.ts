const TENANT = "common"; // supports personal + work/school accounts
const SCOPES = ["Mail.Send", "User.Read", "offline_access"].join(" ");
const TOKEN_URL = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`;

function getRedirectUri() {
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/microsoft/callback`;
}

export function getMicrosoftAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    response_type: "code",
    redirect_uri: getRedirectUri(),
    scope: SCOPES,
    response_mode: "query",
    prompt: "select_account",
  });
  return `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/authorize?${params}`;
}

export async function exchangeMicrosoftCode(code: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID!,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
      code,
      redirect_uri: getRedirectUri(),
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error("Failed to exchange Microsoft code");
  return res.json();
}

export async function refreshMicrosoftToken(refreshToken: string) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID!,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      scope: SCOPES,
    }),
  });
  if (!res.ok) throw new Error("Failed to refresh Microsoft token");
  return res.json();
}

export async function getMicrosoftUserEmail(accessToken: string): Promise<string> {
  const res = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  return data.mail || data.userPrincipalName || "Unknown";
}

export async function sendOutlookEmail({
  accessToken,
  refreshToken,
  to,
  subject,
  body,
}: {
  accessToken: string;
  refreshToken: string;
  to: string;
  subject: string;
  body: string;
}): Promise<{ newAccessToken?: string }> {
  const payload = JSON.stringify({
    message: {
      subject,
      body: { contentType: "Text", content: body },
      toRecipients: [{ emailAddress: { address: to } }],
    },
    saveToSentItems: true,
  });

  const doSend = (token: string) =>
    fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

  let res = await doSend(accessToken);

  // Token expired — refresh and retry once
  if (res.status === 401) {
    const refreshed = await refreshMicrosoftToken(refreshToken);
    res = await doSend(refreshed.access_token);
    if (!res.ok && res.status !== 202) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || "Failed to send via Outlook");
    }
    return { newAccessToken: refreshed.access_token };
  }

  if (!res.ok && res.status !== 202) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Failed to send via Outlook");
  }

  return {};
}
