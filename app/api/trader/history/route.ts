import { NextRequest, NextResponse } from "next/server";

// Server-side proxy for CoinGecko market history. Keeps the client
// same-origin (no CORS/ad-blocker issues) and caches upstream responses
// so many visitors share one CoinGecko call instead of each hitting
// the free-tier rate limit.

const ALLOWED_IDS = new Set(["bitcoin", "pax-gold", "ethereum", "solana"]);

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!ALLOWED_IDS.has(id)) {
    return NextResponse.json({ error: "unknown asset" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=180`,
      {
        headers: { accept: "application/json" },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) {
      return NextResponse.json({ error: `upstream ${res.status}` }, { status: 502 });
    }
    const data: { prices?: [number, number][] } = await res.json();
    if (!data.prices?.length) {
      return NextResponse.json({ error: "no price data" }, { status: 502 });
    }
    return NextResponse.json(
      { prices: data.prices },
      { headers: { "cache-control": "public, max-age=120, stale-while-revalidate=300" } }
    );
  } catch (err) {
    return NextResponse.json({ error: String((err as Error).message ?? err) }, { status: 502 });
  }
}
