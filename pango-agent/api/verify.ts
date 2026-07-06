import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthorized } from "../lib/auth";
import { config } from "../lib/config";
import { wasStoppedSince } from "../lib/gmail";
import { getSession, saveSession } from "../lib/store";
import { placeCall, sendFallbackSms } from "../lib/twilio";

// Delivered by QStash ~5 minutes after the user pressed 1. Checks Gmail for
// Pango's "Parking deactivation" email; if it never arrived, the user got
// distracted and the calls resume as a new cycle (up to MAX_CYCLES).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const session = await getSession();
  if (!session || session.endedReason) {
    return res.status(200).json({ ok: true, done: true, reason: session?.endedReason ?? "no session" });
  }
  if (session.phase !== "verifying") {
    return res.status(200).json({ ok: true, ignored: `session is in phase ${session.phase}` });
  }

  let stopped = false;
  try {
    stopped = await wasStoppedSince(session.startedAt);
  } catch {
    // Can't read Gmail -> assume not stopped; a spurious reminder call is
    // cheaper than a night of parking charges.
  }

  if (stopped) {
    session.endedReason = "verified";
    await saveSession(session);
    return res.status(200).json({ ok: true, done: true, reason: "verified" });
  }

  if (session.cycle >= config.maxCycles) {
    session.endedReason = "max_cycles";
    await saveSession(session);
    await sendFallbackSms();
    return res.status(200).json({ ok: true, done: true, reason: "max_cycles", smsSent: true });
  }

  session.cycle += 1;
  session.attempts = 1;
  session.phase = "calling";
  await saveSession(session);
  const callSid = await placeCall(req.headers.host, session.attempts);
  return res.status(200).json({ ok: true, recalling: true, cycle: session.cycle, callSid });
}
