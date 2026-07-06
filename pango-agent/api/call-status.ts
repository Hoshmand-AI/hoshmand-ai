import type { VercelRequest, VercelResponse } from "@vercel/node";
import { config } from "../lib/config";
import { getSession, saveSession } from "../lib/store";
import { isValidTwilioRequest, placeCall, sendFallbackSms } from "../lib/twilio";

// Twilio reports here when a call ends (answered, voicemail, no-answer,
// busy, failed). If the session is still unconfirmed, redial immediately —
// back to back — until MAX_ATTEMPTS, then send the fallback SMS.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isValidTwilioRequest(req)) {
    return res.status(403).json({ error: "Invalid Twilio signature" });
  }

  const callStatus = (req.body?.CallStatus as string | undefined) ?? "";
  const terminal = ["completed", "no-answer", "busy", "failed", "canceled"];
  if (!terminal.includes(callStatus)) {
    return res.status(200).json({ ok: true, ignored: callStatus });
  }

  const session = await getSession();
  if (!session || session.endedReason) {
    return res.status(200).json({ ok: true, done: true, reason: session?.endedReason ?? "no session" });
  }

  if (session.attempts >= config.maxAttempts) {
    session.endedReason = "max_attempts";
    await saveSession(session);
    await sendFallbackSms();
    return res.status(200).json({ ok: true, done: true, reason: "max_attempts", smsSent: true });
  }

  session.attempts += 1;
  await saveSession(session);
  const callSid = await placeCall(req.headers.host, session.attempts);
  return res.status(200).json({ ok: true, redialed: true, attempt: session.attempts, callSid });
}
