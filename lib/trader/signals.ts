// Rule-based signal engine. Combines four independent indicator readings
// into a single verdict with plain-English reasoning. Deterministic and
// transparent by design — no black box, no prediction claims.

import { sma, rsi, macd, percentChange } from "./indicators";

export type SignalLevel = "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "STRONG_SELL";

export interface SignalReason {
  indicator: string;
  reading: string;
  vote: number; // -2 (bearish) … +2 (bullish)
}

export interface Signal {
  level: SignalLevel;
  score: number;
  reasons: SignalReason[];
  warnings: string[];
  computedAt: number;
}

export const SIGNAL_LABELS: Record<SignalLevel, string> = {
  STRONG_BUY: "Strong buy zone",
  BUY: "Buy zone",
  HOLD: "Hold / wait",
  SELL: "Sell zone",
  STRONG_SELL: "Strong sell zone",
};

function voteWord(vote: number): string {
  if (vote >= 2) return "strongly bullish";
  if (vote === 1) return "bullish";
  if (vote === 0) return "neutral";
  if (vote === -1) return "bearish";
  return "strongly bearish";
}

// Requires ~180 daily closes for stable SMA50 / MACD readings.
export function computeSignal(closes: number[]): Signal | null {
  if (closes.length < 60) return null;

  const price = closes[closes.length - 1];
  const reasons: SignalReason[] = [];
  const warnings: string[] = [];

  // 1. Trend — 20-day vs 50-day moving average
  const sma20 = sma(closes, 20)[closes.length - 1];
  const sma50 = sma(closes, 50)[closes.length - 1];
  if (sma20 !== null && sma50 !== null) {
    let vote: number;
    let reading: string;
    if (sma20 > sma50 && price > sma20) {
      vote = 2;
      reading = "Price is above the 20-day average, which is above the 50-day. The trend is up.";
    } else if (sma20 > sma50) {
      vote = 1;
      reading = "The 20-day average is above the 50-day (uptrend), but price has dipped below the 20-day.";
    } else if (sma20 < sma50 && price < sma20) {
      vote = -2;
      reading = "Price is below the 20-day average, which is below the 50-day. The trend is down.";
    } else {
      vote = -1;
      reading = "The 20-day average is below the 50-day (downtrend), though price is holding above the 20-day.";
    }
    reasons.push({ indicator: "Trend (SMA 20/50)", reading, vote });
  }

  // 2. RSI(14) — overbought / oversold
  const rsiNow = rsi(closes, 14)[closes.length - 1];
  if (rsiNow !== null) {
    let vote: number;
    let reading: string;
    const r = Math.round(rsiNow);
    if (rsiNow < 30) {
      vote = 2;
      reading = `RSI is ${r} — deeply oversold. Sellers may be exhausted.`;
    } else if (rsiNow < 45) {
      vote = 1;
      reading = `RSI is ${r} — on the low side, leaning oversold.`;
    } else if (rsiNow <= 55) {
      vote = 0;
      reading = `RSI is ${r} — neutral, no edge either way.`;
    } else if (rsiNow <= 70) {
      vote = -1;
      reading = `RSI is ${r} — on the high side, leaning overbought.`;
    } else {
      vote = -2;
      reading = `RSI is ${r} — overbought. Late buyers often become exit liquidity here.`;
    }
    reasons.push({ indicator: "Momentum (RSI 14)", reading, vote });
  }

  // 3. MACD(12,26,9) — momentum direction and acceleration
  const { histogram } = macd(closes);
  const h0 = histogram[closes.length - 1];
  const h1 = histogram[closes.length - 2];
  if (h0 !== null && h1 !== null) {
    let vote: number;
    let reading: string;
    if (h0 > 0 && h0 > h1) {
      vote = 2;
      reading = "MACD histogram is positive and rising — upward momentum is accelerating.";
    } else if (h0 > 0) {
      vote = 1;
      reading = "MACD histogram is positive but fading — momentum is up, yet slowing.";
    } else if (h0 < 0 && h0 < h1) {
      vote = -2;
      reading = "MACD histogram is negative and falling — downward momentum is accelerating.";
    } else {
      vote = -1;
      reading = "MACD histogram is negative but recovering — still bearish, losing steam.";
    }
    reasons.push({ indicator: "Acceleration (MACD)", reading, vote });
  }

  // 4. 7-day rate of change
  const change7 = percentChange(closes, 7);
  if (change7 !== null) {
    const pct = change7.toFixed(1);
    const vote = change7 > 1 ? 1 : change7 < -1 ? -1 : 0;
    reasons.push({
      indicator: "7-day change",
      reading: `Price moved ${change7 >= 0 ? "+" : ""}${pct}% over the last 7 days — ${voteWord(vote)}.`,
      vote,
    });
    if (Math.abs(change7) > 15) {
      warnings.push(
        `Volatility warning: a ${pct}% move in one week is extreme. Signals are least reliable exactly when moves feel most exciting.`
      );
    }
  }

  const score = reasons.reduce((acc, r) => acc + r.vote, 0);
  let level: SignalLevel;
  if (score >= 4) level = "STRONG_BUY";
  else if (score >= 2) level = "BUY";
  else if (score > -2) level = "HOLD";
  else if (score > -4) level = "SELL";
  else level = "STRONG_SELL";

  return { level, score, reasons, warnings, computedAt: Date.now() };
}
