import type { Metadata } from "next";
import TradePanel from "@/components/saraf/TradePanel";

export const metadata: Metadata = {
  title: "Trade — Saraf",
  description: "Place Bitcoin and gold orders through your own Coinbase account. You review and place every trade.",
};

export default function TradePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-400/70">Trade</p>
        <h1 className="mt-3 font-serif text-3xl text-white sm:text-4xl">The agent advises. You decide.</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/60">
          Saraf shows its read on Bitcoin and gold and lets you place the trade through your own Coinbase account —
          one order at a time, under your risk caps, with you pressing the button. It never trades on its own. (Oil
          isn&apos;t on Coinbase, so it&apos;s not here.)
        </p>
      </div>
      <TradePanel />
    </div>
  );
}
