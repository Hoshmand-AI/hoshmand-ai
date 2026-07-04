"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchHistory, formatUsd } from "@/lib/trader/market";
import { computeSignal, type Signal } from "@/lib/trader/signals";
import { loadRiskSettings, guardOrder, DEFAULT_RISK_SETTINGS, type RiskSettings } from "@/lib/saraf/risk";

// Coinbase can trade Bitcoin and gold (via PAXG). Oil is not available on
// Coinbase. Symbols are Coinbase product ids; prices come from the same
// public feed the agent uses.
const ASSETS = [
  { key: "BTC", name: "Bitcoin", symbol: "BTC-USD", coingeckoId: "bitcoin" },
  { key: "GOLD", name: "Gold (PAXG)", symbol: "PAXG-USD", coingeckoId: "pax-gold" },
];

interface Status {
  liveEnabled: boolean;
  killSwitch: boolean;
  maxNotionalUsd: number;
  coinbaseConfigured: boolean;
}
interface Acct {
  connected: boolean;
  portfolioUsd?: number;
  cashUsd?: number;
  positions?: { asset: string; free: number; usdValue: number }[];
  reason?: string;
}
interface AssetView {
  key: string;
  name: string;
  symbol: string;
  price: number;
  signal: Signal | null;
}

export default function TradePanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [acct, setAcct] = useState<Acct | null>(null);
  const [assets, setAssets] = useState<AssetView[]>([]);
  const [risk, setRisk] = useState<RiskSettings>(DEFAULT_RISK_SETTINGS);
  const [loading, setLoading] = useState(true);

  const [asset, setAsset] = useState(ASSETS[0].key);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState(10);
  const [placing, setPlacing] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    setRisk(loadRiskSettings());
    (async () => {
      const [s, a] = await Promise.all([
        fetch("/api/saraf/status").then((r) => r.json()).catch(() => null),
        fetch("/api/saraf/account?platform=coinbase").then((r) => r.json()).catch(() => null),
      ]);
      setStatus(s);
      setAcct(a);
      const views = await Promise.all(
        ASSETS.map(async (as) => {
          try {
            const h = await fetchHistory(as.coingeckoId);
            return { ...as, price: h.closes[h.closes.length - 1], signal: computeSignal(h.closes) };
          } catch {
            return { ...as, price: 0, signal: null };
          }
        })
      );
      setAssets(views);
      setLoading(false);
    })();
  }, []);

  const live = status?.liveEnabled ?? false;
  const selected = assets.find((a) => a.key === asset);
  const refPrice = selected?.price ?? 0;

  // Server cap and the user's own device cap both apply; the tighter wins.
  const effectiveCap = Math.min(status?.maxNotionalUsd ?? Infinity, risk.maxOrderUsd);
  const clientGuard = useMemo(() => guardOrder(risk, { notionalUsd: amount }), [risk, amount]);

  async function place() {
    setResult(null);
    if (status?.killSwitch) {
      setResult({ ok: false, message: "Server kill switch is ON — trading halted." });
      return;
    }
    if (!clientGuard.ok) {
      setResult({ ok: false, message: clientGuard.reason ?? "Blocked by your risk limits." });
      return;
    }
    setPlacing(true);
    try {
      const url = "/api/saraf/execute" + (live ? "?mode=live" : "");
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ platform: "coinbase", symbol: selected?.symbol, side, notionalUsd: amount, refPrice }),
      });
      const fill = await res.json();
      setResult({
        ok: Boolean(fill.ok),
        message: fill.ok
          ? `${fill.mode === "live" ? "LIVE" : "Simulated"} ${side} of ${fill.filledUnits?.toFixed(6)} ${selected?.key} at ${formatUsd(fill.price)}.`
          : fill.message ?? "Order failed.",
      });
    } catch (e) {
      setResult({ ok: false, message: String((e as Error).message ?? e) });
    } finally {
      setPlacing(false);
    }
  }

  function useAgentCall(a: AssetView) {
    if (!a.signal) return;
    const bullish = a.signal.level === "BUY" || a.signal.level === "STRONG_BUY";
    const bearish = a.signal.level === "SELL" || a.signal.level === "STRONG_SELL";
    setAsset(a.key);
    setSide(bearish ? "sell" : "buy");
    setResult(null);
    if (!bullish && !bearish) setResult({ ok: false, message: `The agent says HOLD ${a.key} — no trade suggested right now.` });
  }

  if (loading) {
    return <div className="flex h-40 items-center justify-center rounded-lg border border-white/10 bg-navy-900 text-white/40">Loading your account and the market…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Mode banner */}
      <div
        className="rounded-lg border p-5"
        style={
          live
            ? { borderColor: "rgba(224,133,133,0.4)", backgroundColor: "rgba(224,133,133,0.08)" }
            : { borderColor: "rgba(95,184,148,0.3)", backgroundColor: "rgba(95,184,148,0.07)" }
        }
      >
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: live ? "#E09999" : "#7FCBA9" }} />
          <p className="text-[14px] font-semibold text-white">
            {live ? "LIVE — orders here spend real money" : "Paper mode — every order is simulated"}
          </p>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-white/60">
          {live
            ? `Orders route to your real Coinbase account, capped at ${formatUsd(effectiveCap)} each. You place each trade yourself — nothing trades on its own.`
            : "You can practice placing orders and see exactly what would happen. To trade for real, an admin sets SARAF_LIVE_ENABLED on the server and your Coinbase key needs trade permission."}
        </p>
      </div>

      {/* Account */}
      <div className="rounded-lg border border-white/10 bg-navy-900 p-6">
        <h3 className="text-[15px] font-semibold text-white">Your Coinbase account</h3>
        {acct?.connected ? (
          <>
            <div className="mt-3 flex flex-wrap gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-white/40">Portfolio value</p>
                <p className="mt-1 font-mono text-2xl text-gold-400">{formatUsd(acct.portfolioUsd ?? 0)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-white/40">USD cash</p>
                <p className="mt-1 font-mono text-lg text-white">{formatUsd(acct.cashUsd ?? 0)}</p>
              </div>
            </div>
            {acct.positions && acct.positions.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[360px] text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40">
                      <th className="pb-2 pr-4 font-medium">Asset</th>
                      <th className="pb-2 pr-4 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acct.positions.map((p) => (
                      <tr key={p.asset} className="border-b border-white/5">
                        <td className="py-2 pr-4 font-semibold text-white">{p.asset}</td>
                        <td className="py-2 pr-4 font-mono text-white/70">{p.free.toFixed(6)}</td>
                        <td className="py-2 font-mono text-white/70">{p.usdValue > 0 ? formatUsd(p.usdValue) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <p className="mt-2 text-[13px] text-white/60">
            Not connected — {acct?.reason ?? "add your Coinbase keys on the Connections page."} You can still practice with simulated orders below.
          </p>
        )}
      </div>

      {/* Agent read per asset */}
      <div className="grid gap-4 sm:grid-cols-2">
        {assets.map((a) => {
          const lvl = a.signal?.level ?? "HOLD";
          const tone = lvl.includes("BUY") ? "#7FCBA9" : lvl.includes("SELL") ? "#E09999" : "rgba(255,255,255,0.6)";
          return (
            <div key={a.key} className="rounded-lg border border-white/10 bg-navy-900 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-white">{a.name}</h3>
                  <p className="mt-0.5 font-mono text-lg text-white">{a.price ? formatUsd(a.price) : "—"}</p>
                </div>
                <span className="rounded-md border px-2 py-1 text-[11px] font-bold uppercase" style={{ borderColor: tone, color: tone }}>
                  {lvl.replace("_", " ")}
                </span>
              </div>
              <p className="mt-2 text-[12.5px] text-white/55">{a.signal?.reasons[0]?.reading ?? "Warming up…"}</p>
              <button
                type="button"
                onClick={() => useAgentCall(a)}
                className="mt-3 rounded-md border border-white/15 px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-white/5"
              >
                Use the agent&apos;s call
              </button>
            </div>
          );
        })}
      </div>

      {/* Manual order ticket */}
      <div className="rounded-lg border border-white/10 bg-navy-900 p-6">
        <h3 className="text-[15px] font-semibold text-white">Place an order</h3>
        <p className="mt-1 mb-4 text-[13px] text-white/55">You review and place every trade. Nothing here is automatic.</p>
        <div className="grid gap-4 sm:grid-cols-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-wider text-white/40">Asset</span>
            <select value={asset} onChange={(e) => setAsset(e.target.value)} className="h-11 w-full rounded-md border border-white/15 bg-navy-950 px-3 text-[14px] text-white outline-none focus:border-gold-500">
              {ASSETS.map((a) => (
                <option key={a.key} value={a.key}>{a.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-wider text-white/40">Side</span>
            <select value={side} onChange={(e) => setSide(e.target.value as "buy" | "sell")} className="h-11 w-full rounded-md border border-white/15 bg-navy-950 px-3 text-[14px] text-white outline-none focus:border-gold-500">
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-wider text-white/40">Amount (USD)</span>
            <input type="number" min={1} value={amount} onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))} className="h-11 w-full rounded-md border border-white/15 bg-navy-950 px-3 font-mono text-[14px] text-white outline-none focus:border-gold-500" />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={place}
              disabled={placing || amount <= 0}
              className="h-11 w-full rounded-md text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: live ? "#B85C5C" : "#C8963E", color: live ? "#fff" : "#0A1628" }}
            >
              {placing ? "Placing…" : live ? `Place LIVE ${side}` : `Simulate ${side}`}
            </button>
          </div>
        </div>

        {selected && amount > 0 && refPrice > 0 && (
          <p className="mt-3 text-[12.5px] text-white/50">
            ≈ {(amount / refPrice).toFixed(6)} {selected.key} at {formatUsd(refPrice)}. Your caps: per order {formatUsd(effectiveCap)}, daily loss limit {formatUsd(risk.dailyLossLimitUsd)}.
          </p>
        )}
        {!clientGuard.ok && (
          <p className="mt-2 text-[12.5px]" style={{ color: "#E09999" }}>⚠ {clientGuard.reason}</p>
        )}

        {result && (
          <div
            className="mt-4 rounded-md border px-4 py-3 text-[13px]"
            style={
              result.ok
                ? { borderColor: "rgba(95,184,148,0.35)", backgroundColor: "rgba(95,184,148,0.08)", color: "#8ad3b2" }
                : { borderColor: "rgba(224,133,133,0.32)", backgroundColor: "rgba(224,133,133,0.07)", color: "#e6a2a2" }
            }
          >
            {result.ok ? "✓ " : "✗ "}{result.message}
          </div>
        )}
      </div>
    </div>
  );
}
