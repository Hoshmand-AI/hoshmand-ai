import { createHash, timingSafeEqual } from "crypto";
import type { VercelRequest } from "@vercel/node";
import { config } from "./config";

// Accepts the secret via `X-Trigger-Secret` header or `?secret=` query param.
export function isAuthorized(req: VercelRequest): boolean {
  const provided =
    (req.headers["x-trigger-secret"] as string | undefined) ??
    (typeof req.query.secret === "string" ? req.query.secret : undefined);
  if (!provided) return false;
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(config.triggerSecret).digest();
  return timingSafeEqual(a, b);
}
