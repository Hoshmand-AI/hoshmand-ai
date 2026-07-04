import Link from "next/link";
import AgentConsole from "@/components/saraf/AgentConsole";
import LiveAccount from "@/components/saraf/LiveAccount";

export default function SarafPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Hero */}
      <div className="mb-10 max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold-400/70">
          Autonomous trading agent · صرّاف
        </p>
        <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">It trades. You watch.</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/60">
          Saraf connects to your own exchange account and decides for itself when to buy and when to sell{" "}
          <span className="text-white/80">Bitcoin, Oil, and Gold</span> — using transparent rules and hard risk limits.
          It runs on a simulated $100 first and, before it ever touches real money, it has to prove one thing on this
          page: that trading beats simply holding. Most strategies can&apos;t. This one has to earn your trust with
          numbers.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/saraf/connections"
            className="inline-flex h-10 items-center rounded-md bg-gold-500 px-4 text-[13px] font-semibold text-navy-950 transition-colors hover:bg-gold-400"
          >
            Connect an exchange
          </Link>
          <a
            href="#agent"
            className="inline-flex h-10 items-center rounded-md border border-white/15 px-4 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/5"
          >
            See it trade (paper)
          </a>
        </div>
      </div>

      <div id="agent">
        <LiveAccount />
        <AgentConsole />
      </div>
    </div>
  );
}
