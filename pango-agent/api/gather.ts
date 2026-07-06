import type { VercelRequest, VercelResponse } from "@vercel/node";
import twilio from "twilio";
import { config } from "../lib/config";
import { scheduleVerify } from "../lib/qstash";
import { getSession, saveSession } from "../lib/store";
import { isValidTwilioRequest, xml } from "../lib/twilio";

// Handles the digit pressed during a call. Pressing 1 pauses the calls and
// schedules a Gmail check for the deactivation email 5 minutes out.
// scheduleVerify runs before the phase flips: if scheduling fails, the
// session stays in "calling" and the status callback simply redials.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isValidTwilioRequest(req)) {
    return res.status(403).json({ error: "Invalid Twilio signature" });
  }

  const digits = (req.body?.Digits as string | undefined) ?? "";
  const twiml = new twilio.twiml.VoiceResponse();

  if (digits === "1") {
    const session = await getSession();
    if (session && !session.endedReason) {
      await scheduleVerify(req.headers.host);
      session.phase = "verifying";
      await saveSession(session);
    }
    twiml.say(
      { voice: "Polly.Matthew" },
      "Got it. Now go stop the parking session in the Pango app. " +
        `In ${Math.round(config.verifyDelaySeconds / 60)} minutes I will check your email ` +
        "for the deactivation receipt, and if it is not there, I will start calling you again. Goodbye."
    );
    twiml.hangup();
  } else {
    twiml.say({ voice: "Polly.Matthew" }, "That was not 1.");
    twiml.redirect({ method: "POST" }, "/api/voice");
  }

  return xml(res, twiml.toString());
}
