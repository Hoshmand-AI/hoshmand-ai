// Market data via CoinGecko, proxied through /api/trader/history (no key).
// Gold is tracked through PAXG — a token backed 1:1 by one troy ounce of
// physical gold, so its price closely follows gold spot.

export interface AssetConfig {
  id: string; // CoinGecko id
  symbol: string;
  name: string;
  note?: string;
}

export const ASSETS: AssetConfig[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "pax-gold", symbol: "GOLD", name: "Gold", note: "via PAXG — 1 token = 1 troy oz of vaulted gold" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "solana", symbol: "SOL", name: "Solana" },
];

export interface MarketHistory {
  assetId: string;
  closes: number[]; // daily closes, oldest → newest (last = latest price)
  timestamps: number[];
  fetchedAt: number;
}

export async function fetchHistory(assetId: string): Promise<MarketHistory> {
  // Same-origin API route that proxies + caches CoinGecko server-side.
  const res = await fetch(`/api/trader/history?id=${assetId}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`market data ${res.status} for ${assetId}`);
  const data: { prices: [number, number][] } = await res.json();
  if (!data.prices?.length) throw new Error(`No price data for ${assetId}`);
  return {
    assetId,
    closes: data.prices.map(([, p]) => p),
    timestamps: data.prices.map(([t]) => t),
    fetchedAt: Date.now(),
  };
}

export function formatUsd(value: number): string {
  const digits = Math.abs(value) >= 1000 ? 0 : 2;
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
