import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthorized } from "../lib/auth";
import { getSession } from "../lib/store";

// Read-only view of the current/most recent session, for debugging.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const session = await getSession();
  return res.status(200).json({ session });
}
