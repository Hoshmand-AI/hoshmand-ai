// Paper-trading broker. Pure, deterministic accounting for a simulated
// account — no real money touches this. Every fill is recorded so the
// agent's full history is auditable.

export interface Position {
  symbol: string;
  units: number;
  avgCost: number; // average cost basis in USD per unit
}

export interface Fill {
  t: number; // timestamp of the fill
  symbol: string;
  side: "buy" | "sell";
  units: number;
  price: number;
  usd: number; // notional traded
  reason: string;
}

export interface Portfolio {
  cash: number;
  positions: Record<string, Position>;
  fills: Fill[];
}

export interface AccountValue {
  cash: number;
  holdings: number;
  equity: number;
  positions: { symbol: string; units: number; value: number; unrealizedPct: number }[];
}

export function newPortfolio(startingCash: number): Portfolio {
  return { cash: startingCash, positions: {}, fills: [] };
}

// Trading fee approximating a retail crypto spread/commission (0.4%).
const FEE_RATE = 0.004;

export function buy(pf: Portfolio, symbol: string, usd: number, price: number, t: number, reason: string): Portfolio {
  const spend = Math.min(usd, pf.cash);
  if (spend <= 0 || price <= 0) return pf;
  const fee = spend * FEE_RATE;
  const units = (spend - fee) / price;
  if (units <= 0) return pf;

  const existing = pf.positions[symbol];
  const newUnits = (existing?.units ?? 0) + units;
  const newCostBasis = (existing ? existing.avgCost * existing.units : 0) + (spend - fee);
  const positions = {
    ...pf.positions,
    [symbol]: { symbol, units: newUnits, avgCost: newCostBasis / newUnits },
  };
  const fill: Fill = { t, symbol, side: "buy", units, price, usd: spend, reason };
  return { cash: pf.cash - spend, positions, fills: [...pf.fills, fill] };
}

export function sell(pf: Portfolio, symbol: string, fraction: number, price: number, t: number, reason: string): Portfolio {
  const pos = pf.positions[symbol];
  if (!pos || pos.units <= 0 || price <= 0) return pf;
  const f = Math.max(0, Math.min(1, fraction));
  const units = pos.units * f;
  if (units <= 0) return pf;

  const gross = units * price;
  const fee = gross * FEE_RATE;
  const proceeds = gross - fee;
  const remaining = pos.units - units;
  const positions = { ...pf.positions };
  if (remaining <= 1e-12) delete positions[symbol];
  else positions[symbol] = { ...pos, units: remaining };
  const fill: Fill = { t, symbol, side: "sell", units, price, usd: gross, reason };
  return { cash: pf.cash + proceeds, positions, fills: [...pf.fills, fill] };
}

export function value(pf: Portfolio, prices: Record<string, number>): AccountValue {
  let holdings = 0;
  const positions = Object.values(pf.positions).map((p) => {
    const price = prices[p.symbol] ?? p.avgCost;
    const v = p.units * price;
    holdings += v;
    return {
      symbol: p.symbol,
      units: p.units,
      value: v,
      unrealizedPct: p.avgCost > 0 ? ((price - p.avgCost) / p.avgCost) * 100 : 0,
    };
  });
  return { cash: pf.cash, holdings, equity: pf.cash + holdings, positions };
}
