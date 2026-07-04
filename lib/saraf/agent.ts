// The autonomous trading policy. Given each asset's price history, it
// decides — on its own — what to buy, sell, or hold, sizes each position
// under hard risk caps, and explains every decision. Deterministic: the
// same inputs always yield the same actions, so its behaviour is auditable
// and testable. No prediction is claimed; it reacts to what price has done.

import { computeSignal, type Signal, type SignalLevel } from "@/lib/trader/signals";
import { buy, sell, value, type Portfolio } from "./portfolio";

// Pick the indicator reading that best explains a decision, so the stated
// reason never contradicts the action. `dir` > 0 favors the most bullish
// reading, < 0 the most bearish.
function dominantReason(sig: Signal, dir: number): string {
  const sorted = [...sig.reasons].sort((a, b) => (dir >= 0 ? b.vote - a.vote : a.vote - b.vote));
  return sorted[0]?.reading ?? sig.reasons[0]?.reading ?? "";
}

export interface RiskConfig {
  maxWeightPerAsset: number; // cap on any single position as a fraction of equity
  cashFloor: number; // fraction of equity always kept in cash
  buyChunk: number; // fraction of equity deployed per buy step
}

export const DEFAULT_RISK: RiskConfig = {
  maxWeightPerAsset: 0.5,
  cashFloor: 0.1,
  buyChunk: 0.25,
};

export interface AgentDecision {
  symbol: string;
  action: "buy" | "sell" | "hold";
  level: SignalLevel;
  score: number;
  reason: string;
}

export interface AssetSnapshot {
  symbol: string;
  closes: number[]; // history up to and including the current bar
}

export interface AgentStep {
  portfolio: Portfolio;
  decisions: AgentDecision[];
}

// Run one decision cycle at time `t`. Assets are processed sells-first so
// freed cash can fund new buys in the same cycle.
export function step(pf: Portfolio, assets: AssetSnapshot[], t: number, risk: RiskConfig = DEFAULT_RISK): AgentStep {
  const prices: Record<string, number> = {};
  const graded = assets
    .map((a) => {
      const price = a.closes[a.closes.length - 1];
      prices[a.symbol] = price;
      return { ...a, price, signal: computeSignal(a.closes) };
    })
    .filter((a) => a.signal !== null);

  const decisions: AgentDecision[] = [];
  let next = pf;

  // 1. Exits first.
  for (const a of graded) {
    const sig = a.signal!;
    const held = next.positions[a.symbol];
    if (held && (sig.level === "SELL" || sig.level === "STRONG_SELL")) {
      const fraction = sig.level === "STRONG_SELL" ? 1 : 0.5;
      const why = dominantReason(sig, -1);
      next = sell(next, a.symbol, fraction, a.price, t, `${sig.level} (score ${sig.score}): ${why}`);
      decisions.push({ symbol: a.symbol, action: "sell", level: sig.level, score: sig.score, reason: `Trimmed ${Math.round(fraction * 100)}% — ${why}` });
    }
  }

  // 2. Entries / adds, sized under the risk caps.
  for (const a of graded) {
    const sig = a.signal!;
    if (sig.level !== "BUY" && sig.level !== "STRONG_BUY") {
      if (!decisions.find((d) => d.symbol === a.symbol)) {
        const bearish = sig.level === "SELL" || sig.level === "STRONG_SELL";
        const reason = bearish
          ? `Signal is bearish but no ${a.symbol} position to exit — staying out. ${dominantReason(sig, -1)}`
          : dominantReason(sig, 0) || "No edge — waiting.";
        decisions.push({ symbol: a.symbol, action: "hold", level: sig.level, score: sig.score, reason });
      }
      continue;
    }
    const acct = value(next, prices);
    const equity = acct.equity;
    const held = acct.positions.find((p) => p.symbol === a.symbol);
    const currentWeight = held ? held.value / equity : 0;
    const investableCash = Math.max(0, next.cash - equity * risk.cashFloor);
    const roomToCap = Math.max(0, risk.maxWeightPerAsset - currentWeight) * equity;
    const stepSize = equity * risk.buyChunk * (sig.level === "STRONG_BUY" ? 1 : 0.6);
    const spend = Math.min(investableCash, roomToCap, stepSize);

    if (spend > equity * 0.02) {
      const why = dominantReason(sig, 1);
      next = buy(next, a.symbol, spend, a.price, t, `${sig.level} (score ${sig.score}): ${why}`);
      decisions.push({ symbol: a.symbol, action: "buy", level: sig.level, score: sig.score, reason: `Bought ~$${spend.toFixed(2)} — ${why}` });
    } else {
      decisions.push({ symbol: a.symbol, action: "hold", level: sig.level, score: sig.score, reason: held ? "Already at target weight — holding." : "Signal positive but risk caps leave no room this cycle." });
    }
  }

  return { portfolio: next, decisions };
}
