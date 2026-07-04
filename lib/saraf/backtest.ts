// Backtest: replay the autonomous agent over historical prices, bar by bar,
// and compare its result to simply buying and holding. This is the honesty
// check — it answers "would this agent have actually beaten doing nothing?"
// with numbers instead of promises.

import { newPortfolio, value, type Portfolio } from "./portfolio";
import { step, type AssetSnapshot, type RiskConfig, DEFAULT_RISK } from "./agent";

export interface EquityPoint {
  t: number;
  agent: number;
  hold: number;
}

export interface BacktestResult {
  startCash: number;
  finalAgent: number;
  finalHold: number;
  agentReturnPct: number;
  holdReturnPct: number;
  agentMaxDrawdownPct: number;
  holdMaxDrawdownPct: number;
  trades: number;
  curve: EquityPoint[];
  portfolio: Portfolio;
  bars: number;
  warmup: number;
}

export interface BacktestInput {
  symbol: string;
  closes: number[];
  timestamps: number[];
}

function maxDrawdown(series: number[]): number {
  let peak = -Infinity;
  let worst = 0;
  for (const v of series) {
    if (v > peak) peak = v;
    if (peak > 0) worst = Math.min(worst, (v - peak) / peak);
  }
  return worst * 100;
}

// `warmup` bars are needed before signals are meaningful (SMA50 / MACD).
export function backtest(inputs: BacktestInput[], startCash = 100, warmup = 60, risk: RiskConfig = DEFAULT_RISK): BacktestResult {
  const n = Math.min(...inputs.map((i) => i.closes.length));
  const times = inputs[0].timestamps;
  let pf = newPortfolio(startCash);

  // Buy-and-hold benchmark: split the starting cash equally across assets
  // at the first tradable bar and never touch it again.
  const holdUnits: Record<string, number> = {};
  const perAsset = startCash / inputs.length;
  for (const inp of inputs) holdUnits[inp.symbol] = perAsset / inp.closes[warmup];

  const curve: EquityPoint[] = [];
  const agentEquity: number[] = [];
  const holdEquity: number[] = [];

  for (let t = warmup; t < n; t++) {
    const snapshots: AssetSnapshot[] = inputs.map((i) => ({ symbol: i.symbol, closes: i.closes.slice(0, t + 1) }));
    const prices: Record<string, number> = {};
    for (const i of inputs) prices[i.symbol] = i.closes[t];

    pf = step(pf, snapshots, times[t] ?? t, risk).portfolio;

    const agent = value(pf, prices).equity;
    const hold = inputs.reduce((sum, i) => sum + holdUnits[i.symbol] * i.closes[t], 0);
    agentEquity.push(agent);
    holdEquity.push(hold);
    curve.push({ t: times[t] ?? t, agent, hold });
  }

  const finalAgent = agentEquity[agentEquity.length - 1] ?? startCash;
  const finalHold = holdEquity[holdEquity.length - 1] ?? startCash;

  return {
    startCash,
    finalAgent,
    finalHold,
    agentReturnPct: ((finalAgent - startCash) / startCash) * 100,
    holdReturnPct: ((finalHold - startCash) / startCash) * 100,
    agentMaxDrawdownPct: maxDrawdown(agentEquity),
    holdMaxDrawdownPct: maxDrawdown(holdEquity),
    trades: pf.fills.length,
    curve,
    portfolio: pf,
    bars: n - warmup,
    warmup,
  };
}
