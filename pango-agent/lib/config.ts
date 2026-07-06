function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const config = {
  get twilioAccountSid() {
    return required("TWILIO_ACCOUNT_SID");
  },
  get twilioAuthToken() {
    return required("TWILIO_AUTH_TOKEN");
  },
  get twilioPhoneNumber() {
    return required("TWILIO_PHONE_NUMBER");
  },
  get userPhoneNumber() {
    return required("USER_PHONE_NUMBER");
  },
  get triggerSecret() {
    return required("TRIGGER_SECRET");
  },

  get maxAttempts() {
    return parseInt(process.env.MAX_ATTEMPTS || "15", 10);
  },
  // Seconds each call rings before giving up and retrying.
  get ringTimeoutSeconds() {
    return parseInt(process.env.RING_TIMEOUT_SECONDS || "25", 10);
  },
  get callMessage() {
    return (
      process.env.CALL_MESSAGE ||
      "This is your Pango parking reminder. You just left your parents' house. " +
        "Please open the Pango app and stop your parking session now, or you will keep getting charged."
    );
  },
  get smsMessage() {
    return (
      process.env.SMS_MESSAGE ||
      "Pango reminder: you left your parents' house. STOP your Pango parking session now or you'll keep getting charged!"
    );
  },
};

// Public HTTPS base URL of this deployment, used for Twilio webhooks.
export function baseUrl(host: string | undefined): string {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL.replace(/\/$/, "");
  if (!host) throw new Error("Cannot determine base URL: no Host header and PUBLIC_BASE_URL unset");
  return `https://${host}`;
}
