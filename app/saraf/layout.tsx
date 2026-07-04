import type { Metadata, Viewport } from "next";
import Link from "next/link";
import PwaRegister from "@/components/saraf/PwaRegister";

export const metadata: Metadata = {
  title: "Saraf — Autonomous Trading Agent",
  description:
    "Saraf, a Hoshmand AI product. An autonomous, rule-based trading agent that connects to your own exchange account, decides when to buy and sell, and proves itself on paper before trading real money.",
  manifest: "/saraf.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Saraf" },
  icons: { apple: "/saraf-icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0A1628",
};

export default function SarafLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-navy-950">
      <header className="border-b border-white/10 bg-navy-950">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/saraf" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gold-500 text-[15px] font-bold text-navy-950">
              $
            </span>
            <span className="flex items-baseline gap-2">
              <span className="font-serif text-lg text-white">Saraf</span>
              <span className="hidden text-[11px] text-white/40 sm:inline">a Hoshmand AI product</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/saraf/trade" className="text-[13px] font-medium text-white/60 transition-colors hover:text-white">
              Trade
            </Link>
            <Link href="/saraf/risk" className="text-[13px] font-medium text-white/60 transition-colors hover:text-white">
              Risk
            </Link>
            <Link href="/saraf/connections" className="text-[13px] font-medium text-white/60 transition-colors hover:text-white">
              Connections
            </Link>
            <span className="rounded-md border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-400">
              Paper mode
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
      <PwaRegister />

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-[12px] text-white/40 sm:px-6">
          <Link href="/" className="text-white/50 underline-offset-2 hover:underline">
            Saraf by Hoshmand AI
          </Link>{" "}
          is an autonomous trading tool operating on a simulated account by default. It is not financial advice.
          Connecting a live exchange account trades real money at your own risk; past performance never guarantees
          future results.
        </div>
      </footer>
    </div>
  );
}
