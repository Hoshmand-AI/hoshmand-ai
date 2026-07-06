import { config } from "./config";

// Read-only Gmail access (gmail.readonly scope) via a long-lived OAuth
// refresh token. Pango emails within ~1 minute of every session event:
//   "Parking activation, Plate: ..."   from noreply@mypango.com
//   "Parking deactivation, Plate: ..." from noreply@mypango.com
// so the inbox is a reliable source of truth for session state.

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1/users/me";

async function accessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.googleClientId,
      client_secret: config.googleClientSecret,
      refresh_token: config.googleRefreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Google token refresh failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function searchMessageIds(token: string, query: string, max: number): Promise<string[]> {
  const url = `${GMAIL_API}/messages?q=${encodeURIComponent(query)}&maxResults=${max}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Gmail search failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { messages?: { id: string }[] };
  return (data.messages ?? []).map((m) => m.id);
}

async function getMessage(token: string, id: string): Promise<{ snippet: string; internalDate: number }> {
  const res = await fetch(`${GMAIL_API}/messages/${id}?format=minimal`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Gmail message fetch failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { snippet?: string; internalDate?: string };
  return { snippet: data.snippet ?? "", internalDate: parseInt(data.internalDate ?? "0", 10) };
}

// A session is active when the newest activation/deactivation email is an
// activation. Looks back 2 days (his sessions have run 19+ hours).
export async function hasActiveParkingSession(): Promise<boolean> {
  const token = await accessToken();
  const ids = await searchMessageIds(
    token,
    'from:mypango.com ("Parking activation" OR "Parking deactivation") newer_than:2d',
    3
  );
  if (ids.length === 0) return false;
  const messages = await Promise.all(ids.map((id) => getMessage(token, id)));
  const newest = messages.reduce((a, b) => (b.internalDate > a.internalDate ? b : a));
  // "deactivation" contains "activation", so test for the longer word.
  return !newest.snippet.toLowerCase().includes("deactivation");
}

// Did a "Parking deactivation" email arrive since the given time? A 5-minute
// slack window catches sessions stopped moments before the geofence fired.
export async function wasStoppedSince(sinceIso: string): Promise<boolean> {
  const token = await accessToken();
  const epoch = Math.floor(new Date(sinceIso).getTime() / 1000) - 5 * 60;
  const ids = await searchMessageIds(
    token,
    `from:mypango.com "Parking deactivation" after:${epoch}`,
    1
  );
  return ids.length > 0;
}
