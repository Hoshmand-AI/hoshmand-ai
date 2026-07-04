import { NextResponse } from "next/server";

// Reports the deployment's trading configuration so the UI can show an
// honest live/paper state without ever exposing secrets.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    liveEnabled: process.env.SARAF_LIVE_ENABLED === "true",
    killSwitch: process.env.SARAF_KILL_SWITCH === "true",
    maxNotionalUsd: Number(process.env.SARAF_MAX_NOTIONAL_USD ?? 250),
    alpacaConfigured: Boolean(process.env.ALPACA_API_KEY_ID && process.env.ALPACA_API_SECRET_KEY),
    coinbaseConfigured: Boolean(process.env.COINBASE_API_KEY_NAME && process.env.COINBASE_API_PRIVATE_KEY),
  });
}
