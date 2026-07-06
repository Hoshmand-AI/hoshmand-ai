import { Redis } from "@upstash/redis";

export interface Session {
  id: string;
  attempts: number;
  confirmed: boolean;
  startedAt: string;
  endedReason?: "confirmed" | "max_attempts" | "stopped";
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
