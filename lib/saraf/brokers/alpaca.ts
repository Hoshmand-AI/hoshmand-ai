// Alpaca adapter (server-side only). Alpaca is the primary broker because a
// single account trades all three of Saraf's assets: Bitcoin (crypto), Oil
// (USO ETF) and Gold (GLD ETF). Auth is a simple API key/secret header pair,
// so this adapter is fully implemented — it just needs real credentials and
// network at deploy time. Paper vs. live is chosen by the base URL.

import type { AccountSummary, BrokerAdapter, Balance, Fill, OrderIntent, PlatformInfo } from "./types";

const LIVE_TRADING = "https://api.alpaca.markets";
const PAPER_TRADING = "https://paper-api.alpaca.markets";
const DATA = "https://data.alpaca.markets";

export interface AlpacaCredentials {
  keyId: string;
  secret: string;
  live: boolean; // false → Alpaca paper endpoint (real broker, fake money)
}

export class AlpacaAdapter implements BrokerAdapter {
  info: PlatformInfo;
  private creds: AlpacaCredentials;

  constructor(platform: PlatformInfo, creds: AlpacaCredentials) {
    this.info = platform;
    this.creds = creds;
  }

  private headers() {
    return {
      "APCA-API-KEY-ID": this.creds.keyId,
      "APCA-API-SECRET-KEY": this.creds.secret,
      accept: "application/json",
      "content-type": "application/json",
    };
  }

  private base() {
    return this.creds.live ? LIVE_TRADING : PAPER_TRADING;
  }

  async getPrice(symbol: string): Promise<number> {
    const isCrypto = symbol.includes("/");
    const url = isCrypto
      ? `${DATA}/v1beta3/crypto/us/latest/trades?symbols=${encodeURIComponent(symbol)}`
      : `${DATA}/v2/stocks/${symbol}/trades/latest`;
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) throw new Error(`Alpaca price ${res.status}`);
    const data = await res.json();
    if (isCrypto) return Number(data?.trades?.[symbol]?.p ?? 0);
    return Number(data?.trade?.p ?? 0);
  }

  async getBalances(): Promise<Balance[]> {
    const res = await fetch(`${this.base()}/v2/positions`, { headers: this.headers() });
    if (!res.ok) throw new Error(`Alpaca positions ${res.status}`);
    const positions: { symbol: string; qty: string; market_value: string }[] = await res.json();
    return positions.map((p) => ({ asset: p.symbol, free: Number(p.qty), usdValue: Number(p.market_value) }));
  }

  async getAccount(): Promise<AccountSummary> {
    const res = await fetch(`${this.base()}/v2/account`, { headers: this.headers() });
    if (!res.ok) throw new Error(`Alpaca account ${res.status}`);
    const a: { status: string; cash: string; portfolio_value: string } = await res.json();
    const positions = await this.getBalances().catch(() => []);
    return {
      status: a.status,
      cashUsd: Number(a.cash),
      portfolioUsd: Number(a.portfolio_value),
      positions,
    };
  }

  async placeOrder(order: OrderIntent): Promise<Fill> {
    const isCrypto = order.symbol.includes("/");
    const body = {
      symbol: order.symbol,
      notional: order.notionalUsd.toFixed(2), // fractional dollar-based order
      side: order.side,
      type: "market",
      time_in_force: isCrypto ? "gtc" : "day",
    };
    const res = await fetch(`${this.base()}/v2/orders`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        mode: this.creds.live ? "live" : "paper",
        platform: order.platform,
        symbol: order.symbol,
        side: order.side,
        filledUnits: 0,
        price: 0,
        feeUsd: 0,
        notionalUsd: order.notionalUsd,
        message: `Alpaca rejected the order: ${data?.message ?? res.status}`,
      };
    }
    const price = order.refPrice ?? (await this.getPrice(order.symbol).catch(() => 0));
    return {
      ok: true,
      mode: this.creds.live ? "live" : "paper",
      platform: order.platform,
      symbol: order.symbol,
      side: order.side,
      filledUnits: price > 0 ? order.notionalUsd / price : 0,
      price,
      feeUsd: 0,
      notionalUsd: order.notionalUsd,
      brokerOrderId: data?.id,
      message: `${this.creds.live ? "Live" : "Paper"} order submitted to Alpaca (${data?.status ?? "accepted"}).`,
    };
  }
}
