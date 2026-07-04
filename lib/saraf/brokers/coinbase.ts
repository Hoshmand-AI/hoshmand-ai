// Coinbase Advanced Trade adapter (server-side only).
//
// This is the REAL structure for live trading, but it is deliberately inert
// until credentials are provided and live mode is explicitly enabled. It
// never runs in the browser and never reads keys from the client. Going
// live requires, on the server:
//   COINBASE_API_KEY_NAME   — the CDP key id (e.g. organizations/.../apiKeys/...)
//   COINBASE_API_PRIVATE_KEY — the EC private key (PEM), stored in a secret manager
//
// Coinbase's current auth signs a short-lived ES256 JWT per request. That
// signing step is isolated below so it can be implemented with a vetted JWT
// library at deploy time without touching the rest of Saraf.

import { createPrivateKey, randomBytes, sign as cryptoSign } from "node:crypto";
import type { AccountSummary, BrokerAdapter, Balance, Fill, OrderIntent, PlatformInfo } from "./types";

const HOST = "api.coinbase.com";
const API_HOST = `https://${HOST}`;

export interface CoinbaseCredentials {
  keyName: string;
  privateKeyPem: string;
}

export class CoinbaseAdapter implements BrokerAdapter {
  info: PlatformInfo;
  private creds: CoinbaseCredentials;

  constructor(platform: PlatformInfo, creds: CoinbaseCredentials) {
    this.info = platform;
    this.creds = creds;
  }

  // Public market data needs no auth.
  async getPrice(symbol: string): Promise<number> {
    const res = await fetch(`${API_HOST}/api/v3/brokerage/market/products/${symbol}`, {
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Coinbase price ${res.status}`);
    const data: { price?: string } = await res.json();
    return Number(data.price ?? 0);
  }

  async getBalances(): Promise<Balance[]> {
    const data = await this.signedRequest<{ accounts?: { currency: string; available_balance: { value: string } }[] }>(
      "GET",
      "/api/v3/brokerage/accounts"
    );
    return (data.accounts ?? []).map((a) => ({
      asset: a.currency,
      free: Number(a.available_balance.value),
      usdValue: 0,
    }));
  }

  async getAccount(): Promise<AccountSummary> {
    const balances = await this.getBalances();
    let cashUsd = 0;
    const positions: Balance[] = [];
    for (const b of balances) {
      if (b.free <= 0) continue;
      if (b.asset === "USD" || b.asset === "USDC") {
        cashUsd += b.free;
        continue;
      }
      // Value each crypto holding at its live USD price.
      let usdValue = 0;
      try {
        usdValue = b.free * (await this.getPrice(`${b.asset}-USD`));
      } catch {
        usdValue = 0; // no USD market for this asset — leave unpriced
      }
      positions.push({ asset: b.asset, free: b.free, usdValue });
    }
    const holdingsUsd = positions.reduce((sum, p) => sum + p.usdValue, 0);
    return { status: "ACTIVE", cashUsd, portfolioUsd: cashUsd + holdingsUsd, positions };
  }

  async placeOrder(order: OrderIntent): Promise<Fill> {
    const price = order.refPrice ?? (await this.getPrice(order.symbol));
    // Coinbase market orders: buys are sized in USD (quote_size); sells are
    // sized in the base asset (base_size), derived from the USD amount.
    const config =
      order.side === "buy"
        ? { quote_size: order.notionalUsd.toFixed(2) }
        : { base_size: (price > 0 ? order.notionalUsd / price : 0).toFixed(8) };
    const body = {
      client_order_id: `saraf-${order.symbol}-${order.side}-${Date.now()}`,
      product_id: order.symbol,
      side: order.side.toUpperCase(),
      order_configuration: { market_market_ioc: config },
    };
    const data = await this.signedRequest<{ success?: boolean; order_id?: string; success_response?: { order_id: string }; error_response?: { message?: string } }>(
      "POST",
      "/api/v3/brokerage/orders",
      body
    );
    if (data.error_response) {
      return {
        ok: false, mode: "live", platform: order.platform, symbol: order.symbol, side: order.side,
        filledUnits: 0, price, feeUsd: 0, notionalUsd: order.notionalUsd,
        message: `Coinbase rejected the order: ${data.error_response.message ?? "unknown error"}`,
      };
    }
    return {
      ok: Boolean(data.success ?? data.order_id ?? data.success_response),
      mode: "live",
      platform: order.platform,
      symbol: order.symbol,
      side: order.side,
      filledUnits: price > 0 ? order.notionalUsd / price : 0,
      price,
      feeUsd: 0,
      notionalUsd: order.notionalUsd,
      brokerOrderId: data.order_id ?? data.success_response?.order_id,
      message: "Live order submitted to Coinbase.",
    };
  }

  // Coinbase CDP auth: a short-lived ES256 JWT signed with the account's EC
  // private key, one per request. Implemented with Node's crypto — no external
  // dependency. Requires real credentials (server env) to produce valid tokens.
  private buildJwt(method: string, path: string): string {
    const now = Math.floor(Date.now() / 1000);
    const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const header = { alg: "ES256", kid: this.creds.keyName, typ: "JWT", nonce: randomBytes(16).toString("hex") };
    const payload = { sub: this.creds.keyName, iss: "cdp", nbf: now, exp: now + 120, uri: `${method} ${HOST}${path}` };
    const signingInput = `${b64(header)}.${b64(payload)}`;
    // Coinbase's downloaded key often stores newlines as literal "\n" text;
    // convert them back to real line breaks so the PEM decodes.
    const pem = this.creds.privateKeyPem.replace(/\\n/g, "\n");
    const key = createPrivateKey(pem);
    // JOSE requires the raw (r||s) signature, not DER — dsaEncoding handles it.
    const signature = cryptoSign("SHA256", Buffer.from(signingInput), { key, dsaEncoding: "ieee-p1363" });
    return `${signingInput}.${signature.toString("base64url")}`;
  }

  private async signedRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
    if (!this.creds.keyName || !this.creds.privateKeyPem) {
      throw new Error("Missing Coinbase credentials (COINBASE_API_KEY_NAME / COINBASE_API_PRIVATE_KEY).");
    }
    const token = this.buildJwt(method, path);
    const res = await fetch(`${API_HOST}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", accept: "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Coinbase ${res.status}: ${text.slice(0, 200)}`);
    }
    return (await res.json()) as T;
  }
}
