import { NextRequest, NextResponse } from "next/server";
import { getPlatform } from "@/lib/saraf/brokers/registry";
import { AlpacaAdapter } from "@/lib/saraf/brokers/alpaca";
import { CoinbaseAdapter } from "@/lib/saraf/brokers/coinbase";
import type { BrokerAdapter } from "@/lib/saraf/brokers/types";

// Read-only connection test + live account snapshot. Uses server-side
// credentials to call the broker's account endpoint and reports whether the
// connection is real. Never returns secrets; never places an order.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function adapterFor(platformId: string): BrokerAdapter | { error: string } {
  const platform = getPlatform(platformId);
  if (!platform) return { error: `Unknown platform "${platformId}".` };

  if (platformId === "alpaca") {
    const keyId = process.env.ALPACA_API_KEY_ID;
    const secret = process.env.ALPACA_API_SECRET_KEY;
    if (!keyId || !secret) return { error: "No Alpaca credentials configured on the server." };
    return new AlpacaAdapter(platform, { keyId, secret, live: process.env.SARAF_LIVE_ENABLED === "true" });
  }
  if (platformId === "coinbase") {
    const keyName = process.env.COINBASE_API_KEY_NAME;
    const privateKeyPem = process.env.COINBASE_API_PRIVATE_KEY;
    if (!keyName || !privateKeyPem) return { error: "No Coinbase credentials configured on the server." };
    return new CoinbaseAdapter(platform, { keyName, privateKeyPem });
  }
  return { error: `${platform.name} is not connectable yet.` };
}

export async function GET(req: NextRequest) {
  const platformId = req.nextUrl.searchParams.get("platform") ?? "";
  const result = adapterFor(platformId);
  if ("error" in result) {
    return NextResponse.json({ connected: false, platform: platformId, reason: result.error });
  }
  try {
    const account = await result.getAccount();
    return NextResponse.json({
      connected: true,
      platform: platformId,
      live: process.env.SARAF_LIVE_ENABLED === "true",
      status: account.status,
      cashUsd: account.cashUsd,
      portfolioUsd: account.portfolioUsd,
      positions: account.positions,
    });
  } catch (err) {
    return NextResponse.json({ connected: false, platform: platformId, reason: (err as Error).message ?? String(err) });
  }
}
