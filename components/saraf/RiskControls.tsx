"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_RISK_SETTINGS,
  guardOrder,
  getRealizedLossToday,
  loadRiskSettings,
  saveRiskSettings,
  type RiskSettings,
} from "@/lib/saraf/risk";

interface ServerStatus {
  liveEnabled: boolean;
  killSwitch: boolean;
  maxNotionalUsd: number;
}

export default function RiskControls() {
  const [settings, setSettings] = useState<RiskSettings>(DEFAULT_RISK_SETTINGS);
  const [server, setServer] = useState<ServerStatus | null>(null);
  const [lossToday, setLossToday] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadRiskSettings());
    setLossToday(getRealizedLossToday());
    fetch("/api/saraf/status").then((r) => r.json()).then(setServer).catch(() => setServer(null));
  }, []);

  const update = (patch: Partial<RiskSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveRiskSettings(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  // Live sample check so the user can see the gate working.
  const sample = guardOrder(settings, { notionalUsd: settings.maxOrderUsd });
  const overServerCap = server ? settings.maxOrderUsd > server.maxNotionalUsd : false;

  return (
    <div className="space-y-6">
      {/* Kill switch */}
      <div
        className="rounded-lg border p-6"
        style={
          settings.killSwitch
            ? { borderColor: "rgba(217,128,128,0.4)", backgroundColor: "rgba(217,128,128,0.08)" }
            : { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "#0F2140" }
        }
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-semibold text-white">Kill switch</h3>
            <p className="mt-1 text-[13px] text-white/55">
              One toggle to halt everything. When on, Saraf cannot place a single order — no exceptions.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.killSwitch}
            onClick={() => update({ killSwitch: !settings.killSwitch })}
            className="relative h-8 w-14 shrink-0 rounded-full transition-colors"
            style={{ backgroundColor: settings.killSwitch ? "#B85C5C" : "rgba(255,255,255,0.15)" }}
          >
            <span
              className="absolute top-1 h-6 w-6 rounded-full bg-white transition-all"
              style={{ left: settings.killSwitch ? "1.75rem" : "0.25rem" }}
            />
          </button>
        </div>
        {settings.killSwitch && (
          <p className="mt-4 text-[13px] font-semibold" style={{ color: "#E09999" }}>
            ● Trading halted. Turn this off to let the agent trade again.
          </p>
        )}
      </div>

      {/* Numeric caps */}
      <div className="rounded-lg border border-white/10 bg-navy-900 p-6">
        <h3 className="text-[15px] font-semibold text-white">Your limits</h3>
        <p className="mt-1 mb-5 text-[13px] text-white/55">
          Saved instantly to this device. Every order is checked against these before it&apos;s sent.
        </p>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field
            label="Max per order ($)"
            value={settings.maxOrderUsd}
            min={1}
            onChange={(v) => update({ maxOrderUsd: v })}
            warn={overServerCap ? `Server cap is $${server?.maxNotionalUsd}` : undefined}
          />
          <Field label="Daily loss limit ($)" value={settings.dailyLossLimitUsd} min={1} onChange={(v) => update({ dailyLossLimitUsd: v })} />
          <Field label="Max in one asset (%)" value={settings.maxWeightPerAssetPct} min={5} max={100} onChange={(v) => update({ maxWeightPerAssetPct: v })} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-[12.5px]">
          <span className="text-white/50">
            Booked loss today: <span className="font-semibold text-white">${lossToday.toFixed(2)}</span> / ${settings.dailyLossLimitUsd}
          </span>
          {saved && <span style={{ color: "#7FCBA9" }}>Saved ✓</span>}
        </div>

        {/* Live gate preview */}
        <div className="mt-5 rounded-md border border-white/10 bg-white/[0.02] p-4 text-[12.5px]">
          <p className="text-white/45">Gate check on a sample ${settings.maxOrderUsd} order:</p>
          <p className="mt-1 font-medium" style={{ color: sample.ok ? "#7FCBA9" : "#E09999" }}>
            {sample.ok ? "✓ Would be allowed" : `✗ Blocked — ${sample.reason}`}
          </p>
        </div>
      </div>

      {/* Two-layer explainer */}
      <div className="rounded-lg border border-white/10 bg-navy-900 p-6">
        <h3 className="text-[15px] font-semibold text-white">Two layers protect you</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-white/10 p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-gold-400/70">This device</p>
            <p className="mt-2 text-[13px] text-white/60">The limits above, enforced in your browser before an order leaves. Fast and fully in your hands.</p>
          </div>
          <div className="rounded-md border border-white/10 p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-gold-400/70">The server</p>
            <p className="mt-2 text-[13px] text-white/60">
              {server ? (
                <>
                  Hard cap ${server.maxNotionalUsd}/order · live trading {server.liveEnabled ? "ENABLED" : "off"} · kill switch{" "}
                  {server.killSwitch ? "ON" : "off"}. The server always wins for real money.
                </>
              ) : (
                "The final authority for live trading — set in server config, not from this screen."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  min,
  max,
  onChange,
  warn,
}: {
  label: string;
  value: number;
  min: number;
  max?: number;
  onChange: (v: number) => void;
  warn?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-wider text-white/40">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max ?? Infinity, Number(e.target.value))))}
        className="h-11 w-full rounded-md border border-white/15 bg-navy-950 px-3 text-[14px] text-white outline-none focus:border-gold-500"
      />
      {warn && <span className="mt-1 block text-[11px] text-gold-400/80">{warn}</span>}
    </label>
  );
}
