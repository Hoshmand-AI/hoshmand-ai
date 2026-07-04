"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchHistory, formatUsd } from "@/lib/trader/market";
import { backtest, type BacktestResult, type BacktestInput } from "@/lib/saraf/backtest";
import { step, type AssetSnapshot, type AgentDecision } from "@/lib/saraf/agent";
import { value } from "@/lib/saraf/portfolio";
import { UNIVERSE, demoAssets } from "@/lib/saraf/universe";
import EquityChart from "./EquityChart";

// The demo runs on assets with a free price feed (Bitcoin, Gold via PAXG).
// Oil needs an Alpaca connection for its price data, so it shows as pending.
const DEMO = demoAssets();
const OIL = UNIVERSE.find((a) => a.key === "OIL");

const START_CASH = 100;

interface LoadedAsset extends BacktestInput {}

export default function AgentConsole() {
  const [assets, setAssets] = useState<LoadedAsset[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await Promise.all(
          DEMO.map(async (u) => {
            const h = await fetchHistory(u.coingeckoId as string);
            return { symbol: u.key, closes: h.closes, timestamps: h.timestamps };
          })
        );
        if (!cancelled) setAssets(loaded);
      } catch (e) {
        if (!cancelled) setError(String((e as Error).message ?? e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const result: BacktestResult | null = useMemo(() => {
    if (!assets) return null;
    return backtest(assets, START_CASH);
  }, [assets]);

  // What the agent decides on the most recent bar, given the portfolio the
  // backtest arrived at — i.e. "what would it do right now."
  const latest = useMemo(() => {
    if (!assets || !result) return null;
    const snapshots: AssetSnapshot[] = assets.map((a) => ({ symbol: a.symbol, closes: a.closes }));
    const prices: Record<string, number> = {};
    for (const a of assets) prices[a.symbol] = a.closes[a.closes.length - 1];
    const { decisions } = step(result.portfolio, snapshots, Date.now());
    return { decisions, prices };
  }, [assets, result]);

  if (error) {
    return (
      <div className="rounded-lg border border-white/10 bg-navy-900 p-6 text-white/70">
        Could not load market data ({error}). The agent needs live prices to run.
      </div>
    );
  }

  if (!assets || !result || !latest) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-white/10 bg-navy-900 text-white/40">
        Running the agent over history…
      </div>
    );
  }

  const acct = value(result.portfolio, latest.prices);
  const beatsHold = result.finalAgent >= result.finalHold;

  return (
    <div className="space-y-6">
      {/* Verdict */}
      <div className="rounded-lg border border-white/10 bg-navy-900 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
              Backtest over the last {result.bars} days
            </p>
            <h2 className="mt-2 font-serif text-3xl text-white">
              {formatUsd(result.finalAgent)}{" "}
              <span className="text-[15px] font-sans font-medium" style={{ color: result.agentReturnPct >= 0 ? "#5FB894" : "#D98080" }}>
                {result.agentReturnPct >= 0 ? "+" : ""}
                {result.agentReturnPct.toFixed(1)}%
              </span>
            </h2>
            <p className="mt-1 text-[13px] text-white/50">
              from a simulated {formatUsd(START_CASH)} start · {result.trades} trades executed autonomously
            </p>
          </div>
          <div
            className="rounded-md border px-3 py-2 text-[12px] font-semibold"
            style={
              beatsHold
                ? { borderColor: "rgba(95,184,148,0.35)", backgroundColor: "rgba(95,184,148,0.1)", color: "#7FCBA9" }
                : { borderColor: "rgba(217,128,128,0.35)", backgroundColor: "rgba(217,128,128,0.1)", color: "#E09999" }
            }
          >
            {beatsHold ? "Agent beat buy-and-hold" : "Buy-and-hold won this period"}
          </div>
        </div>

        <div className="mt-5">
          <EquityChart curve={result.curve} startCash={START_CASH} />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          <Stat label="Agent return" value={`${result.agentReturnPct >= 0 ? "+" : ""}${result.agentReturnPct.toFixed(1)}%`} />
          <Stat label="Buy & hold return" value={`${result.holdReturnPct >= 0 ? "+" : ""}${result.holdReturnPct.toFixed(1)}%`} />
          <Stat label="Agent worst drawdown" value={`${result.agentMaxDrawdownPct.toFixed(1)}%`} />
          <Stat label="Hold worst drawdown" value={`${result.holdMaxDrawdownPct.toFixed(1)}%`} />
        </div>

        <p className="mt-5 rounded-md border border-gold-500/20 bg-gold-500/[0.06] px-4 py-3 text-[12.5px] leading-relaxed text-gold-100/80">
          Read this honestly: {beatsHold
            ? "the agent beat holding over this window, but one favorable window is not proof of an edge — it must hold up across many markets before it means anything."
            : "the agent underperformed simply holding over this window. That is the normal result for most active strategies, and exactly why this runs on paper money."}{" "}
          A lower drawdown with a lower return means the agent traded some upside for a smoother ride — that is a real, valid choice, but it is not free money.
        </p>
      </div>

      {/* What the agent would do right now */}
      <div className="rounded-lg border border-white/10 bg-navy-900 p-6">
        <h3 className="text-[15px] font-semibold text-white">What the agent decides right now</h3>
        <p className="mt-1 mb-4 text-[13px] text-white/50">Its live read on each asset, from the same rules it used across the backtest.</p>
        <div className="space-y-3">
          {latest.decisions.map((d) => (
            <DecisionRow key={d.symbol} d={d} price={latest.prices[d.symbol]} />
          ))}
          {OIL && (
            <div className="flex flex-wrap items-baseline gap-3 rounded-md border border-dashed border-white/10 bg-white/[0.02] px-4 py-3">
              <span className="rounded bg-white/8 px-2 py-0.5 text-[11px] font-bold uppercase text-white/50">Pending</span>
              <span className="font-semibold text-white">{OIL.name}</span>
              <span className="text-[11px] text-white/35">via {OIL.alpacaSymbol}</span>
              <span className="w-full text-[12.5px] text-white/55">
                Oil has no free crypto price feed — connect Alpaca to stream USO and let the agent trade it. {OIL.note}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Paper portfolio */}
      <div className="rounded-lg border border-white/10 bg-navy-900 p-6">
        <h3 className="text-[15px] font-semibold text-white">Simulated portfolio</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Stat label="Cash" value={formatUsd(acct.cash)} />
          <Stat label="Holdings" value={formatUsd(acct.holdings)} />
          <Stat label="Total equity" value={formatUsd(acct.equity)} highlight />
        </div>
        {acct.positions.length > 0 && (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[380px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40">
                  <th className="pb-2 pr-4 font-medium">Asset</th>
                  <th className="pb-2 pr-4 font-medium">Units</th>
                  <th className="pb-2 pr-4 font-medium">Value</th>
                  <th className="pb-2 font-medium">Unrealized</th>
                </tr>
              </thead>
              <tbody>
                {acct.positions.map((p) => (
                  <tr key={p.symbol} className="border-b border-white/5">
                    <td className="py-2.5 pr-4 font-semibold text-white">{p.symbol}</td>
                    <td className="py-2.5 pr-4 text-white/70">{p.units.toFixed(6)}</td>
                    <td className="py-2.5 pr-4 text-white/70">{formatUsd(p.value)}</td>
                    <td className="py-2.5 font-medium" style={{ color: p.unrealizedPct >= 0 ? "#7FCBA9" : "#E09999" }}>
                      {p.unrealizedPct >= 0 ? "+" : ""}
                      {p.unrealizedPct.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trade log */}
      <div className="rounded-lg border border-white/10 bg-navy-900 p-6">
        <h3 className="text-[15px] font-semibold text-white">Autonomous trade log</h3>
        <p className="mt-1 mb-4 text-[13px] text-white/50">
          Every order the agent placed, newest first — with the reason it acted. Nothing here was approved by a human.
        </p>
        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {[...result.portfolio.fills].reverse().slice(0, 60).map((f, i) => (
            <div key={`${f.t}-${i}`} className="flex flex-wrap items-baseline gap-2 border-b border-white/5 pb-2 text-[12.5px]">
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                style={f.side === "buy" ? { backgroundColor: "rgba(78,139,199,0.18)", color: "#8FB9E0" } : { backgroundColor: "rgba(176,138,56,0.2)", color: "#D4A94F" }}
              >
                {f.side}
              </span>
              <span className="font-semibold text-white">{f.symbol}</span>
              <span className="text-white/70">{formatUsd(f.usd)} @ {formatUsd(f.price)}</span>
              <span className="text-[11px] text-white/35">{new Date(f.t).toLocaleDateString()}</span>
              <span className="w-full text-[11.5px] text-white/45">{f.reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 4 gate */}
      <div className="rounded-lg border border-dashed border-white/15 bg-navy-900/50 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-semibold text-white">Connect a real account</h3>
            <p className="mt-1 max-w-xl text-[13px] text-white/50">
              Live execution through Coinbase (real crypto) comes after the agent proves itself on paper across several
              months and market conditions — behind hard loss caps and a kill switch. Not enabled yet, by design.
            </p>
          </div>
          <button type="button" disabled className="cursor-not-allowed rounded-md border border-white/15 px-4 py-2 text-[13px] font-medium text-white/40">
            Connect Coinbase · locked
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-white/40">{label}</p>
      <p className={`mt-1 font-semibold ${highlight ? "text-2xl text-gold-400" : "text-lg text-white"}`}>{value}</p>
    </div>
  );
}

function DecisionRow({ d, price }: { d: AgentDecision; price: number }) {
  const color =
    d.action === "buy" ? { bg: "rgba(78,139,199,0.18)", fg: "#8FB9E0" } : d.action === "sell" ? { bg: "rgba(176,138,56,0.2)", fg: "#D4A94F" } : { bg: "rgba(255,255,255,0.08)", fg: "rgba(255,255,255,0.6)" };
  return (
    <div className="flex flex-wrap items-baseline gap-3 rounded-md border border-white/5 bg-white/[0.02] px-4 py-3">
      <span className="rounded px-2 py-0.5 text-[11px] font-bold uppercase" style={{ backgroundColor: color.bg, color: color.fg }}>
        {d.action}
      </span>
      <span className="font-semibold text-white">{d.symbol}</span>
      <span className="text-[12px] text-white/50">{formatUsd(price)}</span>
      <span className="text-[11px] text-white/35">signal {d.level.replace("_", " ").toLowerCase()} · score {d.score >= 0 ? "+" : ""}{d.score}</span>
      <span className="w-full text-[12.5px] text-white/60">{d.reason}</span>
    </div>
  );
}
