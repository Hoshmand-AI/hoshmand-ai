import { NextRequest, NextResponse } from "next/server";
import { step, type AssetSnapshot } from "@/lib/saraf/agent";
import { newPortfolio, value } from "@/lib/saraf/portfolio";
import { demoAssets, isMarketOpen, getAsset } from "@/lib/saraf/universe";

// One autonomous decision cycle, meant to be called on a schedule by Vercel
// Cron (see docs/SARAF_DEPLOYMENT.md). This is what lets Saraf act "while you
// sleep" on a serverless deploy: the broker account is the source of truth
// for positions, so no database is required.
//
// Protected by CRON_SECRET so only the scheduler can trigger it. In this
// build it computes and REPORTS the decisions; wiring live order placement
// is the final deploy step, behind SARAF_LIVE_ENABLED + broker credentials.

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided = req.headers.get("authorization")?.replace("Bearer ", "") ?? req.nextUrl.searchParams.get("key");
  if (secret && provided !== secret) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const origin = req.nextUrl.origin;
  const now = new Date();

  // Gather price history for assets that have a feed. Markets that are closed
  // (oil/gold ETFs off-hours) are skipped — you can't trade a closed market.
  const snapshots: AssetSnapshot[] = [];
  const skipped: string[] = [];
  for (const asset of demoAssets()) {
    if (!isMarketOpen(asset, now)) {
      skipped.push(`${asset.key} (market closed)`);
      continue;
    }
    try {
      const res = await fetch(`${origin}/api/trader/history?id=${asset.coingeckoId}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`history ${res.status}`);
      const data: { prices: [number, number][] } = await res.json();
      snapshots.push({ symbol: asset.key, closes: data.prices.map(([, p]) => p) });
    } catch (err) {
      skipped.push(`${asset.key} (${(err as Error).message})`);
    }
  }

  if (snapshots.length === 0) {
    return NextResponse.json({ ok: true, ranAt: now.toISOString(), decisions: [], skipped, message: "No open, priced markets this tick." });
  }

  // Positions live in the broker account in production; here we start flat and
  // report the intended actions for this cycle.
  const { decisions } = step(newPortfolio(0), snapshots, now.getTime());
  const liveEnabled = process.env.SARAF_LIVE_ENABLED === "true";

  return NextResponse.json({
    ok: true,
    ranAt: now.toISOString(),
    mode: liveEnabled ? "live-capable" : "paper",
    skipped,
    decisions: decisions.map((d) => ({ asset: d.symbol, action: d.action, signal: d.level, reason: d.reason })),
    note: liveEnabled
      ? "Live enabled — connect broker order placement here to execute these decisions."
      : "Paper mode — decisions are reported, not executed.",
  });
}
