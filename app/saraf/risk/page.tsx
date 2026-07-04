import type { Metadata } from "next";
import RiskControls from "@/components/saraf/RiskControls";

export const metadata: Metadata = {
  title: "Risk controls — Saraf",
  description: "Your guardrails: kill switch, per-order cap, daily loss limit, and per-asset concentration cap.",
};

export default function RiskPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-400/70">Risk controls</p>
        <h1 className="mt-3 font-serif text-3xl text-white sm:text-4xl">You hold the brakes.</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/60">
          The most important part of trading isn&apos;t the entry — it&apos;s the limit that stops one bad run from
          wiping you out. Set yours here. They&apos;re checked before every order, and the kill switch halts everything
          the instant you flip it.
        </p>
      </div>
      <RiskControls />
    </div>
  );
}
