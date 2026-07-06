import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";
import { isAuthorized } from "../lib/auth";
import { hasActiveParkingSession } from "../lib/gmail";
import { getSession, saveSession } from "../lib/store";
import { placeCall } from "../lib/twilio";

// Fired by the iPhone Shortcuts "When I Leave" automation.
// Only starts the call loop when Gmail shows an active Pango session
// (an activation email with no newer deactivation), and never starts a
// second loop while one is running (geofences can bounce on a single exit).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const existing = await getSession();
  if (existing) {
    return res.status(200).json({
      started: false,
      reason: existing.endedReason
        ? `previous session just ended (${existing.endedReason}); cooling down`
        : "a call loop is already running",
      session: existing,
    });
  }

  let gmailNote = "active Pango session detected in Gmail";
  try {
    if (!(await hasActiveParkingSession())) {
      return res.status(200).json({ started: false, reason: "no active Pango session in Gmail" });
    }
  } catch (err) {
    // Gmail being unreachable must not cost the user money: call anyway.
    gmailNote = `Gmail check failed (${err instanceof Error ? err.message : err}); calling to be safe`;
  }

  const session = {
    id: randomUUID(),
    cycle: 1,
    attempts: 1,
    phase: "calling" as const,
    startedAt: new Date().toISOString(),
  };
  await saveSession(session);

  const callSid = await placeCall(req.headers.host, 1);
  return res.status(200).json({ started: true, callSid, gmailNote, session });
}
