// Paper adapter: simulates fills against a reference price with a realistic
// fee. This is the default execution path and the only one active until a
// live account is explicitly connected and enabled.

import type { AccountSummary, BrokerAdapter, Balance, Fill, OrderIntent, PlatformInfo } from "./types";

const FEE_RATE = 0.004;

export class PaperAdapter implements BrokerAdapter {
  info: PlatformInfo;
  private priceHint: number;

  constructor(platform: PlatformInfo, priceHint = 0) {
    this.info = platform;
    this.priceHint = priceHint;
  }

  async getPrice(): Promise<number> {
    return this.priceHint;
  }

  async getBalances(): Promise<Balance[]> {
    return [];
  }

  async getAccount(): Promise<AccountSummary> {
    return { status: "PAPER", cashUsd: 0, portfolioUsd: 0, positions: [] };
  }

  async placeOrder(order: OrderIntent): Promise<Fill> {
    const price = order.refPrice && order.refPrice > 0 ? order.refPrice : this.priceHint;
    if (!price || price <= 0) {
      return {
        ok: false,
        mode: "paper",
        platform: order.platform,
        symbol: order.symbol,
        side: order.side,
        filledUnits: 0,
        price: 0,
        feeUsd: 0,
        notionalUsd: 0,
        message: "No reference price available to simulate the fill.",
      };
    }
    const fee = order.notionalUsd * FEE_RATE;
    const filledUnits = (order.notionalUsd - fee) / price;
    return {
      ok: true,
      mode: "paper",
      platform: order.platform,
      symbol: order.symbol,
      side: order.side,
      filledUnits,
      price,
      feeUsd: fee,
      notionalUsd: order.notionalUsd,
      brokerOrderId: `paper-${order.symbol}-${order.side}`,
      message: `Simulated ${order.side} of ${filledUnits.toFixed(6)} ${order.symbol} at ${price}.`,
    };
  }
}
