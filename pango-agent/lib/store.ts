import { Redis } from "@upstash/redis";

export interface Session {
  id: string;
  // Verification cycle (1-based): each cycle is a run of calls ended by
  // press-1, followed 5 minutes later by a Gmail check for the
  // deactivation email. No email -> next cycle of calls.
  cycle: number;
  // Calls placed within the current cycle.
  attempts: number;
  phase: "calling" | "verifying";
  startedAt: string;
  endedReason?: "verified" | "max_attempts" | "max_cycles" | "stopped";
}

const KEY = "pango:session";
// A session record lives at most 2 hours; a finished one is kept 10 minutes
// so a bouncing geofence can't immediately start a second call storm.
const ACTIVE_TTL_SECONDS = 2 * 60 * 60;
const FINISHED_TTL_SECONDS = 10 * 60;

const redis = Redis.fromEnv();

export async function getSession(): Promise<Session | null> {
  return await redis.get<Session>(KEY);
}

export async function saveSession(session: Session): Promise<void> {
  const ttl = session.endedReason ? FINISHED_TTL_SECONDS : ACTIVE_TTL_SECONDS;
  await redis.set(KEY, session, { ex: ttl });
}
