// Broker abstraction. Every exchange/platform Saraf can trade through
// implements this one interface, so adding a new venue is a self-contained
// adapter rather than a change to the agent. Credentials are handled ONLY
// server-side — this interface is called from server routes, never the
// browser.

export type AssetClass = "crypto" | "stocks" | "forex" | "commodities";

export type ApiKind =
  | "official" // the platform publishes a supported trading API
  | "unofficial" // only reverse-engineered/unsupported access exists
  | "none"; // no programmatic trading is possible

export type PlatformStatus =
  | "available" // adapter implemented, connectable
  | "planned" // on the roadmap, adapter not built yet
  | "unsupported"; // cannot be automated (no API or ToS forbids it)

export interface PlatformInfo {
  id: string;
  name: string;
  region: string;
  assets: AssetClass[];
  api: ApiKind;
  status: PlatformStatus;
  trading: boolean; // can place orders (vs. read-only)
  docsUrl?: string;
  notes: string;
}

export type OrderSide = "buy" | "sell";

export interface OrderIntent {
  platform: string;
  symbol: string; // e.g. "BTC-USD"
  side: OrderSide;
  notionalUsd: number; // amount of USD to spend (buy) or realize (sell)
  refPrice?: number; // last known price, used for paper simulation
}

export type ExecutionMode = "paper" | "live";

export interface Fill {
  ok: boolean;
  mode: ExecutionMode;
  platform: string;
  symbol: string;
  side: OrderSide;
  filledUnits: number;
  price: number;
  feeUsd: number;
  notionalUsd: number;
  brokerOrderId?: string;
  message: string;
}

export interface Balance {
  asset: string;
  free: number;
  usdValue: number;
}

export interface AccountSummary {
  status: string; // e.g. "ACTIVE"
  cashUsd: number;
  portfolioUsd: number;
  positions: Balance[];
}

// Server-side only. `credentials` are opaque to callers and injected from
// a secret store / environment, never passed through the client.
export interface BrokerAdapter {
  info: PlatformInfo;
  getPrice(symbol: string): Promise<number>;
  getBalances(): Promise<Balance[]>;
  placeOrder(order: OrderIntent): Promise<Fill>;
  getAccount(): Promise<AccountSummary>;
}
