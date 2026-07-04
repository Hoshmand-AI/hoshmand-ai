"use client";

import { useMemo, useRef, useState } from "react";
import type { EquityPoint } from "@/lib/saraf/backtest";
import { formatUsd } from "@/lib/trader/market";

const AGENT_COLOR = "#4E8BC7"; // validated on navy surface
const HOLD_COLOR = "#B08A38";

// Two-series equity curve: the agent vs. buy-and-hold. Direct end-labels
// carry identity so it never relies on color alone.
export default function EquityChart({ curve, startCash }: { curve: EquityPoint[]; startCash: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const { agentPts, holdPts, min, range } = useMemo(() => {
    const all = curve.flatMap((p) => [p.agent, p.hold]);
    const lo = Math.min(...all, startCash);
    const hi = Math.max(...all, startCash);
    const range = hi - lo || 1;
    const toXY = (v: number, i: number) =>
      `${((i / (curve.length - 1)) * 100).toFixed(2)},${(100 - ((v - lo) / range) * 90 - 5).toFixed(2)}`;
    return {
      agentPts: curve.map((p, i) => toXY(p.agent, i)).join(" "),
      holdPts: curve.map((p, i) => toXY(p.hold, i)).join(" "),
      min: lo,
      range,
    };
  }, [curve, startCash]);

  const handleMove = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const frac = (e.clientX - rect.left) / rect.width;
    setHover(Math.max(0, Math.min(curve.length - 1, Math.round(frac * (curve.length - 1)))));
  };

  const hx = hover !== null ? (hover / (curve.length - 1)) * 100 : null;
  const yFor = (v: number) => 100 - ((v - min) / range) * 90 - 5;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full cursor-crosshair"
        style={{ height: 220 }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="Agent equity versus buy-and-hold over time"
      >
        <polyline points={holdPts} fill="none" stroke={HOLD_COLOR} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        <polyline points={agentPts} fill="none" stroke={AGENT_COLOR} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        {hx !== null && (
          <>
            <line x1={hx} y1={0} x2={hx} y2={100} stroke="#ffffff" strokeOpacity={0.25} strokeWidth={1} vectorEffect="non-scaling-stroke" strokeDasharray="3 3" />
            <circle cx={hx} cy={yFor(curve[hover!].agent)} r={3} fill={AGENT_COLOR} stroke="#0A1628" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            <circle cx={hx} cy={yFor(curve[hover!].hold)} r={3} fill={HOLD_COLOR} stroke="#0A1628" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          </>
        )}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-white/15 bg-navy-900 px-3 py-2 text-[11px] shadow-lg"
          style={{ left: `${Math.min(Math.max(hx ?? 0, 14), 86)}%` }}
        >
          <div className="text-white/50">{new Date(curve[hover].t).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
          <div style={{ color: AGENT_COLOR }} className="font-semibold">Agent {formatUsd(curve[hover].agent)}</div>
          <div style={{ color: HOLD_COLOR }} className="font-semibold">Hold {formatUsd(curve[hover].hold)}</div>
        </div>
      )}

      <div className="mt-2 flex items-center gap-5 text-[11px] text-white/50">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: AGENT_COLOR }} /> Agent
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: HOLD_COLOR }} /> Buy &amp; hold
        </span>
      </div>
    </div>
  );
}
