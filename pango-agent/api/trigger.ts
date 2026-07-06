import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";
import { isAuthorized } from "../lib/auth";
import { getSession, saveSession } from "../lib/store";
import { placeCall } from "../lib/twilio";

// Fired by the iPhone Shortcuts "When I Leave" automation.
// Starts the call loop unless one is already running (geofences can bounce
// and fire more than once on a single exit).
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

  const session = {
    id: randomUUID(),
    attempts: 1,
    confirmed: false,
    startedAt: new Date().toISOString(),
  };
  await saveSession(session);

  const callSid = await placeCall(req.headers.host, 1);
  return res.status(200).json({ started: true, callSid, session });
}
