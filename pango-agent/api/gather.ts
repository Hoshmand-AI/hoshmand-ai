import type { VercelRequest, VercelResponse } from "@vercel/node";
import twilio from "twilio";
import { getSession, saveSession } from "../lib/store";
import { isValidTwilioRequest, xml } from "../lib/twilio";

// Handles the digit pressed during a call. Pressing 1 marks the session
// confirmed, which stops the redial loop.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isValidTwilioRequest(req)) {
    return res.status(403).json({ error: "Invalid Twilio signature" });
  }

  const digits = (req.body?.Digits as string | undefined) ?? "";
  const twiml = new twilio.twiml.VoiceResponse();

  if (digits === "1") {
    const session = await getSession();
    if (session && !session.endedReason) {
      session.confirmed = true;
      session.endedReason = "confirmed";
      await saveSession(session);
    }
    twiml.say(
      { voice: "Polly.Matthew" },
      "Confirmed. Don't forget to actually stop the parking session in the Pango app. Goodbye."
    );
    twiml.hangup();
  } else {
    twiml.say({ voice: "Polly.Matthew" }, "That was not 1.");
    twiml.redirect({ method: "POST" }, "/api/voice");
  }

  return xml(res, twiml.toString());
}
