import { NextRequest, NextResponse } from "next/server";
import { getPlatform } from "@/lib/saraf/brokers/registry";
import { PaperAdapter } from "@/lib/saraf/brokers/paper";
import { AlpacaAdapter } from "@/lib/saraf/brokers/alpaca";
import { CoinbaseAdapter } from "@/lib/saraf/brokers/coinbase";
import type { BrokerAdapter, Fill, OrderIntent } from "@/lib/saraf/brokers/types";

// Server-side execution gateway. All orders flow through here so risk limits
// and the live/paper gate are enforced in ONE place the browser cannot
// bypass. Default is internal paper simulation; connecting real credentials
// routes to the broker's paper endpoint, and only an explicit server flag
// unlocks live trading with real money.

export const dynamic = "force-dynamic";

const MAX_NOTIONAL = Number(process.env.SARAF_MAX_NOTIONAL_USD ?? 250);
const KILL_SWITCH = process.env.SARAF_KILL_SWITCH === "true";
const LIVE_ENABLED = process.env.SARAF_LIVE_ENABLED === "true";

const alpacaConfigured = () =>
  Boolean(process.env.ALPACA_API_KEY_ID && process.env.ALPACA_API_SECRET_KEY);
const coinbaseConfigured = () =>
  Boolean(process.env.COINBASE_API_KEY_NAME && process.env.COINBASE_API_PRIVATE_KEY);

function reject(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(req: NextRequest) {
  let intent: OrderIntent;
  try {
    intent = (await req.json()) as OrderIntent;
  } catch {
    return reject("Invalid request body.");
  }

  const platform = getPlatform(intent.platform);
  if (!platform) return reject(`Unknown platform "${intent.platform}".`);
  if (!platform.trading || platform.status === "unsupported") {
    return reject(`${platform.name} cannot be automated — no supported trading API.`);
  }
  if (!intent.symbol || (intent.side !== "buy" && intent.side !== "sell")) {
    return reject("Order must specify a symbol and a side of buy or sell.");
  }
  if (!(intent.notionalUsd > 0)) return reject("Order notional must be positive.");

  // Risk gate — enforced regardless of mode.
  if (KILL_SWITCH) return reject("Trading is halted by the kill switch.", 423);
  if (intent.notionalUsd > MAX_NOTIONAL) {
    return reject(`Order of $${intent.notionalUsd} exceeds the per-order cap of $${MAX_NOTIONAL}.`);
  }

  const wantsLive = req.nextUrl.searchParams.get("mode") === "live";
  if (wantsLive && !LIVE_ENABLED) {
    return reject("Live trading is not enabled on this deployment. Orders run in paper mode only.", 403);
  }

  // Choose the adapter. A REAL order is placed only when the user explicitly
  // asked for live mode, the server has live enabled, and the broker has
  // credentials. Every other case simulates, so paper mode can never move
  // real money even with keys present.
  let adapter: BrokerAdapter;
  const live = wantsLive && LIVE_ENABLED;
  if (live && platform.id === "coinbase" && coinbaseConfigured()) {
    adapter = new CoinbaseAdapter(platform, {
      keyName: process.env.COINBASE_API_KEY_NAME as string,
      privateKeyPem: process.env.COINBASE_API_PRIVATE_KEY as string,
    });
  } else if (platform.id === "alpaca" && alpacaConfigured()) {
    adapter = new AlpacaAdapter(platform, {
      keyId: process.env.ALPACA_API_KEY_ID as string,
      secret: process.env.ALPACA_API_SECRET_KEY as string,
      live,
    });
  } else {
    adapter = new PaperAdapter(platform, intent.refPrice ?? 0);
  }

  try {
    const fill: Fill = await adapter.placeOrder(intent);
    return NextResponse.json(fill);
  } catch (err) {
    return reject(`Order failed: ${(err as Error).message ?? err}`, 502);
  }
}
