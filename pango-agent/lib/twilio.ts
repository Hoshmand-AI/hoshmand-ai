import type { VercelRequest } from "@vercel/node";
import twilio from "twilio";
import { baseUrl, config } from "./config";

export function twilioClient() {
  return twilio(config.twilioAccountSid, config.twilioAuthToken);
}

// Place one reminder call. Twilio fetches TwiML from /api/voice when answered,
// and reports the final outcome to /api/call-status when the call ends.
export async function placeCall(host: string | undefined, attempt: number): Promise<string> {
  const base = baseUrl(host);
  const call = await twilioClient().calls.create({
    to: config.userPhoneNumber,
    from: config.twilioPhoneNumber,
    url: `${base}/api/voice`,
    method: "POST",
    statusCallback: `${base}/api/call-status?attempt=${attempt}`,
    statusCallbackMethod: "POST",
    statusCallbackEvent: ["completed"],
    timeout: config.ringTimeoutSeconds,
  });
  return call.sid;
}

export async function sendFallbackSms(): Promise<void> {
  await twilioClient().messages.create({
    to: config.userPhoneNumber,
    from: config.twilioPhoneNumber,
    body: config.smsMessage,
  });
}

// Verify that a webhook genuinely came from Twilio (X-Twilio-Signature).
export function isValidTwilioRequest(req: VercelRequest): boolean {
  const signature = req.headers["x-twilio-signature"];
  if (typeof signature !== "string") return false;
  const url = `${baseUrl(req.headers.host as string | undefined)}${req.url}`;
  const params = (req.body ?? {}) as Record<string, string>;
  return twilio.validateRequest(config.twilioAuthToken, signature, url, params);
}

export function xml(res: { setHeader: Function; status: Function }, twiml: string) {
  res.setHeader("Content-Type", "text/xml");
  return (res.status(200) as any).send(twiml);
}
