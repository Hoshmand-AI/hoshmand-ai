import { baseUrl, config } from "./config";

// Serverless functions can't sleep 5 minutes, so the delayed verification
// check is delivered by QStash (Upstash's message scheduler): publish now,
// it POSTs to /api/verify after the delay. QStash retries on non-2xx.
export async function scheduleVerify(host: string | undefined): Promise<void> {
  const dest = `${baseUrl(host)}/api/verify?secret=${encodeURIComponent(config.triggerSecret)}`;
  const res = await fetch(`https://qstash.upstash.io/v2/publish/${dest}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.qstashToken}`,
      "Upstash-Delay": `${config.verifyDelaySeconds}s`,
    },
  });
  if (!res.ok) throw new Error(`QStash publish failed: ${res.status} ${await res.text()}`);
}
