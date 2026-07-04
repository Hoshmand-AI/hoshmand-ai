"use client";

import { useEffect, useState } from "react";
import type { PlatformStatus } from "@/lib/saraf/brokers/types";
import type { PlatformEntry } from "@/lib/saraf/brokers/registry";

interface SarafStatus {
  liveEnabled: boolean;
  killSwitch: boolean;
  maxNotionalUsd: number;
  alpacaConfigured: boolean;
  coinbaseConfigured: boolean;
}

const STATUS_STYLE: Record<PlatformStatus, { label: string; bg: string; border: string; fg: string }> = {
  available: { label: "Available", bg: "rgba(95,184,148,0.12)", border: "rgba(95,184,148,0.35)", fg: "#7FCBA9" },
  planned: { label: "Planned", bg: "rgba(176,138,56,0.14)", border: "rgba(176,138,56,0.35)", fg: "#D4A94F" },
  unsupported: { label: "Not supported", bg: "rgba(217,128,128,0.12)", border: "rgba(217,128,128,0.32)", fg: "#E09999" },
};

export default function Connections({ platforms }: { platforms: PlatformEntry[] }) {
  const [status, setStatus] = useState<SarafStatus | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/saraf/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  const live = status?.liveEnabled ?? false;

  return (
    <div className="space-y-6">
      {/* Live/paper banner */}
      <div
        className="rounded-lg border p-5"
        style={
          live
            ? { borderColor: "rgba(217,128,128,0.35)", backgroundColor: "rgba(217,128,128,0.08)" }
            : { borderColor: "rgba(95,184,148,0.3)", backgroundColor: "rgba(95,184,148,0.07)" }
        }
      >
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: live ? "#E09999" : "#7FCBA9" }}
          />
          <p className="text-[14px] font-semibold text-white">
            {live ? "Live trading is ENABLED on this deployment" : "Paper mode — no real money can be traded"}
          </p>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-white/60">
          {live
            ? `Connected accounts can place real orders, capped at $${status?.maxNotionalUsd} per order. The kill switch is ${status?.killSwitch ? "ON — trading halted" : "off"}.`
            : "Every order is simulated. Connecting a real exchange and switching to live trading requires a deliberate, server-side configuration step — it can't be turned on from this screen."}
        </p>
      </div>

      {/* Platform grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {platforms.map((p) => {
          const s = STATUS_STYLE[p.status];
          const connectable = p.status === "available";
          return (
            <div key={p.id} className="rounded-lg border border-white/10 bg-navy-900 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-white">{p.name}</h3>
                    {p.recommended && (
                      <span className="rounded border border-gold-500/40 bg-gold-500/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-gold-300">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[12px] text-white/45">
                    {p.region} · {p.assets.join(", ")}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-md border px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider"
                  style={{ backgroundColor: s.bg, borderColor: s.border, color: s.fg }}
                >
                  {s.label}
                </span>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-white/55">{p.notes}</p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  disabled={!connectable}
                  onClick={() => setSelected(selected === p.id ? null : p.id)}
                  className="rounded-md border px-3 py-1.5 text-[12.5px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  style={
                    connectable
                      ? { backgroundColor: "#C8963E", borderColor: "#C8963E", color: "#0A1628" }
                      : { borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)" }
                  }
                >
                  {connectable ? (selected === p.id ? "Hide setup" : "Connect") : p.status === "planned" ? "Coming soon" : "Unavailable"}
                </button>
                {p.docsUrl && (
                  <a href={p.docsUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] text-white/40 underline-offset-2 hover:text-white/70 hover:underline">
                    API docs
                  </a>
                )}
              </div>

              {selected === p.id && connectable && (
                <ConnectFlow
                  platform={p}
                  configured={p.id === "alpaca" ? status?.alpacaConfigured ?? false : status?.coinbaseConfigured ?? false}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* How live gets turned on */}
      <div className="rounded-lg border border-white/10 bg-navy-900 p-6">
        <h3 className="text-[15px] font-semibold text-white">How real trading gets switched on</h3>
        <p className="mt-1 mb-4 text-[13px] text-white/50">
          By design, this is a deliberate path — not a toggle. Each step exists so real money is never at risk by accident.
        </p>
        <ol className="space-y-3 text-[13px] text-white/70">
          {[
            "Saraf runs on paper across several months and market conditions, and the backtest holds up.",
            "You create a trade-scoped API key inside your own exchange account (you keep custody; Saraf never holds your funds).",
            "The key is stored in the server's secret manager — never in the app, never in the browser.",
            "You set your risk caps: max per-order size, daily loss limit, and the assets Saraf may touch.",
            "Live mode is enabled server-side. The kill switch can halt everything instantly.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white/70">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <p className="mt-5 rounded-md border border-gold-500/20 bg-gold-500/[0.06] px-4 py-3 text-[12.5px] leading-relaxed text-gold-100/75">
          Trading only your own account is fine. If Saraf ever trades on behalf of other people, that is regulated
          money management (registration, custody, and KYC/AML rules) and needs legal counsel before launch — the
          software alone does not make it lawful.
        </p>
      </div>
    </div>
  );
}

interface TestResult {
  connected: boolean;
  status?: string;
  live?: boolean;
  portfolioUsd?: number;
  cashUsd?: number;
  reason?: string;
}

function ConnectFlow({ platform, configured }: { platform: PlatformEntry; configured: boolean }) {
  const isAlpaca = platform.id === "alpaca";
  const envVars = isAlpaca
    ? ["ALPACA_API_KEY_ID", "ALPACA_API_SECRET_KEY"]
    : ["COINBASE_API_KEY_NAME", "COINBASE_API_PRIVATE_KEY"];
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const r = await fetch(`/api/saraf/account?platform=${platform.id}`);
      setResult(await r.json());
    } catch (e) {
      setResult({ connected: false, reason: String((e as Error).message ?? e) });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="mt-4 rounded-md border border-white/10 bg-white/[0.02] p-4">
      <p className="text-[12px] font-semibold uppercase tracking-wider text-white/45">Connect {platform.name}</p>
      <ol className="mt-3 space-y-2 text-[12.5px] text-white/65">
        <li>1. In your {platform.name} account, create an API key with <span className="text-white">trade</span> permission (not withdrawal).</li>
        {isAlpaca && (
          <li>2. Start with your <span className="text-white">paper</span> keys — same code, fake money — to watch the agent trade Bitcoin, Oil, and Gold for real before risking a dollar.</li>
        )}
        <li>
          {isAlpaca ? "3." : "2."} Add the key to the server&apos;s secret manager as{" "}
          {envVars.map((v, i) => (
            <span key={v}>
              {i > 0 && " and "}
              <code className="rounded bg-black/30 px-1 text-[11px] text-gold-200">{v}</code>
            </span>
          ))}
          .
        </li>
        <li>{isAlpaca ? "4." : "3."} Set your risk caps and, when you&apos;re ready, enable live mode on the server.</li>
      </ol>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={runTest}
          disabled={testing}
          className="rounded-md border border-white/15 px-3 py-1.5 text-[12.5px] font-medium text-white transition-colors hover:bg-white/5 disabled:opacity-40"
        >
          {testing ? "Testing…" : "Test connection"}
        </button>
        {!configured && <span className="text-[12px] text-white/45">Add credentials on the server first.</span>}
      </div>

      {result && (
        <div
          className="mt-3 rounded-md border px-3 py-2.5 text-[12.5px]"
          style={
            result.connected
              ? { borderColor: "rgba(95,184,148,0.35)", backgroundColor: "rgba(95,184,148,0.08)", color: "#8ad3b2" }
              : { borderColor: "rgba(224,133,133,0.32)", backgroundColor: "rgba(224,133,133,0.07)", color: "#e6a2a2" }
          }
        >
          {result.connected ? (
            <>
              ✓ Connected to {platform.name} ({result.status}) · {result.live ? "LIVE" : "paper"} · portfolio{" "}
              ${(result.portfolioUsd ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </>
          ) : (
            <>✗ Not connected — {result.reason}</>
          )}
        </div>
      )}
    </div>
  );
}
