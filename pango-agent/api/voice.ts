import type { VercelRequest, VercelResponse } from "@vercel/node";
import twilio from "twilio";
import { config } from "../lib/config";
import { isValidTwilioRequest, xml } from "../lib/twilio";

// TwiML played when a call is answered. The message repeats inside a
// <Gather> so a keypress is captured at any point; no keypress within the
// gather window means the call ends unconfirmed and the loop redials.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isValidTwilioRequest(req)) {
    return res.status(403).json({ error: "Invalid Twilio signature" });
  }

  const twiml = new twilio.twiml.VoiceResponse();
  const gather = twiml.gather({
    input: ["dtmf"],
    numDigits: 1,
    action: "/api/gather",
    method: "POST",
    timeout: 8,
  });
  for (let i = 0; i < 2; i++) {
    gather.say({ voice: "Polly.Matthew" }, config.callMessage);
    gather.pause({ length: 1 });
    gather.say({ voice: "Polly.Matthew" }, "Press 1 to confirm and stop these calls.");
    gather.pause({ length: 2 });
  }
  twiml.say({ voice: "Polly.Matthew" }, "No confirmation received. I will call you again.");

  return xml(res, twiml.toString());
}
