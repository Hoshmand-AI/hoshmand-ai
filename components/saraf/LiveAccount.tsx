"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Acct {
  connected: boolean;
  platform: string;
  live?: boolean;
  status?: string;
  portfolioUsd?: number;
  cashUsd?: number;
  reason?: string;
}

// Shows whether a real brokerage is connected. Checks Alpaca first (the
// recommended broker), then Coinbase. Read-only — never places orders.
export default function LiveAccount() {
  const [acct, setAcct] = useState<Acct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const platform of ["alpaca", "coinbase"]) {
        try {
          const r = await fetch(`/api/saraf/account?platform=${platform}`);
          const data: Acct = await r.json();
          if (data.connected) {
            if (!cancelled) setAcct(data);
            break;
          }
          if (!cancelled) setAcct(data); // keep last (not-connected) for messaging
        } catch {
          /* try next */
        }
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return null;

  const connected = acct?.connected;

  return (
    <div
      className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-5 py-4"
      style={
        connected
          ? { borderColor: "rgba(95,184,148,0.3)", backgroundColor: "rgba(95,184,148,0.07)" }
          : { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "#0F2140" }
      }
    >
      <div className="flex items-center gap-2.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: connected ? "#7FCBA9" : "rgba(255,255,255,0.3)" }} />
        <div className="text-[13px]">
          {connected ? (
            <span className="text-white">
              <span className="font-semibold capitalize">{acct?.platform}</span> connected ·{" "}
              <span className="font-semibold" style={{ color: acct?.live ? "#E09999" : "#7FCBA9" }}>
                {acct?.live ? "LIVE" : "paper"}
              </span>{" "}
              · portfolio ${(acct?.portfolioUsd ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </span>
          ) : (
            <span className="text-white/70">No brokerage connected — the agent runs on a simulated $100 below.</span>
          )}
        </div>
      </div>
      {!connected && (
        <Link href="/saraf/connections" className="text-[13px] font-semibold text-gold-400 hover:text-gold-300">
          Connect an account →
        </Link>
      )}
    </div>
  );
}
