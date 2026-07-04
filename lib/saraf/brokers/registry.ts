// The honest map of what Saraf can and cannot connect to. "Any trading app
// in the world" is not real — most consumer apps have no trading API, and
// some ban automation outright. This list says the truth per platform.

import type { PlatformInfo } from "./types";

// `recommended` marks the best fit for Saraf's Bitcoin + Oil + Gold mix.
export interface PlatformEntry extends PlatformInfo {
  recommended?: boolean;
}

export const PLATFORMS: PlatformEntry[] = [
  {
    id: "alpaca",
    name: "Alpaca",
    region: "US",
    assets: ["crypto", "stocks", "commodities"],
    api: "official",
    status: "available",
    trading: true,
    recommended: true,
    docsUrl: "https://alpaca.markets/docs/",
    notes:
      "The one account that trades all three: Bitcoin (BTC/USD), Oil (USO ETF) and Gold (GLD ETF). Has real paper trading to prove the agent before going live. US accounts only.",
  },
  {
    id: "coinbase",
    name: "Coinbase",
    region: "US / Global",
    assets: ["crypto"],
    api: "official",
    status: "available",
    trading: true,
    docsUrl: "https://docs.cdp.coinbase.com/advanced-trade/docs/welcome",
    notes: "Official Advanced Trade API — good for Bitcoin and PAXG gold, but cannot trade oil (no crypto oil market).",
  },
  {
    id: "kraken",
    name: "Kraken",
    region: "US / Global",
    assets: ["crypto"],
    api: "official",
    status: "planned",
    trading: true,
    docsUrl: "https://docs.kraken.com/rest/",
    notes: "Official REST API with order placement. Adapter on the roadmap.",
  },
  {
    id: "binance",
    name: "Binance",
    region: "Global (restricted in US)",
    assets: ["crypto"],
    api: "official",
    status: "planned",
    trading: true,
    docsUrl: "https://binance-docs.github.io/apidocs/spot/en/",
    notes: "Official Spot API. US users must use Binance.US, which has a separate, more limited API.",
  },
  {
    id: "ibkr",
    name: "Interactive Brokers",
    region: "Global",
    assets: ["stocks", "forex", "commodities"],
    api: "official",
    status: "planned",
    trading: true,
    docsUrl: "https://www.interactivebrokers.com/en/trading/ib-api.php",
    notes: "Deepest global access (stocks, options, futures, forex) but the most complex integration.",
  },
  {
    id: "robinhood",
    name: "Robinhood",
    region: "US",
    assets: ["stocks", "crypto"],
    api: "none",
    status: "unsupported",
    trading: false,
    notes: "No official trading API. Automating it relies on unofficial access that violates its terms — Saraf will not.",
  },
];

export function getPlatform(id: string): PlatformEntry | undefined {
  return PLATFORMS.find((p) => p.id === id);
}
