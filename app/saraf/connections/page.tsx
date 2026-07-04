import type { Metadata } from "next";
import Connections from "@/components/saraf/Connections";
import { PLATFORMS } from "@/lib/saraf/brokers/registry";

export const metadata: Metadata = {
  title: "Connections — Saraf",
  description: "Connect Saraf to your own exchange account to trade on your behalf. Paper by default; live is hard-gated.",
};

export default function ConnectionsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-400/70">Connections</p>
        <h1 className="mt-3 font-serif text-3xl text-white sm:text-4xl">Trade through your own account.</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/60">
          Saraf never holds your money. You connect your own exchange with a trade-scoped API key, keep custody of your
          funds, and Saraf places orders on your behalf under limits you set. Not every app can be automated — here is
          the honest state of each.
        </p>
      </div>
      <Connections platforms={PLATFORMS} />
    </div>
  );
}
