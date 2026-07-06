import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthorized } from "../lib/auth";
import { getSession, saveSession } from "../lib/store";

// Manual kill switch (e.g. a "Stop Pango calls" shortcut on your phone).
// Marks the active session stopped so no further calls are placed.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const session = await getSession();
  if (!session || session.endedReason) {
    return res.status(200).json({ stopped: false, reason: "no active call loop" });
  }

  session.endedReason = "stopped";
  await saveSession(session);
  return res.status(200).json({ stopped: true, attemptsMade: session.attempts });
}
