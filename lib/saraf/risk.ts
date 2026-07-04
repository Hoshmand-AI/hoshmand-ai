// Client-side risk controls. These are the user's own guardrails, persisted
// in the browser and enforced before any order is sent. They sit on TOP of
// the server-enforced caps (in /api/saraf/execute) — the server is always
// the final authority for live trading, but these give the user a fast,
// visible layer they fully control, including an instant kill switch.

export interface RiskSettings {
  killSwitch: boolean;
  maxOrderUsd: number;
  dailyLossLimitUsd: number;
  maxWeightPerAssetPct: number;
}

export const DEFAULT_RISK_SETTINGS: RiskSettings = {
  killSwitch: false,
  maxOrderUsd: 25,
  dailyLossLimitUsd: 10,
  maxWeightPerAssetPct: 50,
};

const KEY = "saraf_risk_settings_v1";
const LOSS_KEY = "saraf_daily_loss_v1"; // { date: 'YYYY-MM-DD', realized: number }

export function loadRiskSettings(): RiskSettings {
  if (typeof localStorage === "undefined") return DEFAULT_RISK_SETTINGS;
  try {
    return { ...DEFAULT_RISK_SETTINGS, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") };
  } catch {
    return DEFAULT_RISK_SETTINGS;
  }
}

export function saveRiskSettings(s: RiskSettings): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

function todayKey(now: Date): string {
  return now.toISOString().slice(0, 10);
}

// Realized loss booked so far today (a positive number = dollars lost).
export function getRealizedLossToday(now = new Date()): number {
  if (typeof localStorage === "undefined") return 0;
  try {
    const rec = JSON.parse(localStorage.getItem(LOSS_KEY) ?? "{}");
    return rec.date === todayKey(now) ? Math.max(0, Number(rec.realized) || 0) : 0;
  } catch {
    return 0;
  }
}

// Record a closed-trade P&L (negative = a loss) toward today's running total.
export function recordRealizedPnl(pnlUsd: number, now = new Date()): void {
  if (typeof localStorage === "undefined") return;
  const loss = pnlUsd < 0 ? -pnlUsd : 0;
  const prior = getRealizedLossToday(now);
  localStorage.setItem(LOSS_KEY, JSON.stringify({ date: todayKey(now), realized: prior + loss }));
}

export interface GuardInput {
  notionalUsd: number;
  assetWeightAfterPct?: number; // resulting weight of this asset if the order fills
}

export interface GuardResult {
  ok: boolean;
  reason?: string;
}

// The single client-side gate every order passes through.
export function guardOrder(settings: RiskSettings, input: GuardInput, now = new Date()): GuardResult {
  if (settings.killSwitch) return { ok: false, reason: "Kill switch is ON — all trading is halted." };
  if (!(input.notionalUsd > 0)) return { ok: false, reason: "Order size must be positive." };
  if (input.notionalUsd > settings.maxOrderUsd) {
    return { ok: false, reason: `Order $${input.notionalUsd.toFixed(2)} exceeds your per-order cap of $${settings.maxOrderUsd}.` };
  }
  if (getRealizedLossToday(now) >= settings.dailyLossLimitUsd) {
    return { ok: false, reason: `Daily loss limit of $${settings.dailyLossLimitUsd} reached — trading paused until tomorrow.` };
  }
  if (input.assetWeightAfterPct !== undefined && input.assetWeightAfterPct > settings.maxWeightPerAssetPct) {
    return { ok: false, reason: `That fill would put ${input.assetWeightAfterPct.toFixed(0)}% in one asset, over your ${settings.maxWeightPerAssetPct}% cap.` };
  }
  return { ok: true };
}
