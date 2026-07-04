// The three assets Saraf trades, and how each maps to a real broker symbol
// and a price source. Bitcoin is 24/7 crypto; oil and gold are ETFs that
// only trade during US market hours.

export type AssetKey = "BTC" | "OIL" | "GOLD";
export type Session = "24/7" | "us-market-hours";

export interface TradableAsset {
  key: AssetKey;
  name: string;
  klass: "crypto" | "commodity-etf";
  alpacaSymbol: string; // symbol used to trade on Alpaca
  coingeckoId?: string; // free price source for the paper demo (crypto only)
  session: Session;
  note: string;
}

export const UNIVERSE: TradableAsset[] = [
  {
    key: "BTC",
    name: "Bitcoin",
    klass: "crypto",
    alpacaSymbol: "BTC/USD",
    coingeckoId: "bitcoin",
    session: "24/7",
    note: "Trades around the clock.",
  },
  {
    key: "OIL",
    name: "Oil",
    klass: "commodity-etf",
    alpacaSymbol: "USO",
    session: "us-market-hours",
    note: "Via the USO ETF. Tracks crude with some roll decay over long holds; trades only during US market hours.",
  },
  {
    key: "GOLD",
    name: "Gold",
    klass: "commodity-etf",
    alpacaSymbol: "GLD",
    coingeckoId: "pax-gold", // PAXG tracks gold spot — used only for the free demo price feed
    session: "us-market-hours",
    note: "Via the GLD ETF for live trading; the paper demo prices gold from PAXG (1 token = 1 oz).",
  },
];

// Assets that have a free public price feed usable in the no-broker demo.
export function demoAssets(): TradableAsset[] {
  return UNIVERSE.filter((a) => a.coingeckoId);
}

export function getAsset(key: AssetKey): TradableAsset | undefined {
  return UNIVERSE.find((a) => a.key === key);
}

// US equity/ETF regular session in America/New_York, Mon–Fri 9:30–16:00.
// Bitcoin is always open.
export function isMarketOpen(asset: TradableAsset, now: Date): boolean {
  if (asset.session === "24/7") return true;
  const ny = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = ny.getDay();
  if (day === 0 || day === 6) return false;
  const minutes = ny.getHours() * 60 + ny.getMinutes();
  return minutes >= 9 * 60 + 30 && minutes < 16 * 60;
}
