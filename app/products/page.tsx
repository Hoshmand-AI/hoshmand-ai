import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
  description: "AI products built by Hoshmand AI. Starting with MindCue — smart reminders from screenshots.",
};

export default function ProductsPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-navy-900 py-16 sm:py-20">
        <Container>
          <p className="eyebrow text-white/40 mb-4">Products</p>
          <h1
            className="max-w-2xl text-4xl sm:text-5xl mb-4"
            style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "white" }}
          >
            Products I'm shipping and maintaining.
          </h1>
          <p className="max-w-xl text-[15px] text-white/50">
            MindCue is launching soon. Future products will appear here as they become real.
          </p>
        </Container>
      </section>

      {/* Products grid */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <ProductCard
              title="MindCue AI"
              tagline="Smart reminders from screenshots."
              status="Available on iOS"
              href="/mindcue"
              appStoreUrl="https://apps.apple.com/us/app/mindcue-ai/id6757585894"
              bullets={[
                "AI-powered screenshot understanding",
                "Staggered reminder follow-ups (no pileups)",
                "Deep links to apps and actions",
                "Full-screen reminder experience",
                "Privacy-minded defaults",
              ]}
            />

            {/* Placeholder */}
            <div className="card flex items-center justify-center p-8 opacity-50 min-h-[240px]">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-warm-200">
                  <svg className="h-5 w-5 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <p className="text-[13px] text-warm-400">More products coming soon</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Build in public note */}
      <section className="border-t border-warm-200 bg-warm-100 py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <SectionTitle eyebrow="Process" title="How products get made here." />
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-warm-600">
              <p>
                Every product starts with a real problem worth solving. We build the smallest version that delivers genuine value, ship it, and improve from there.
              </p>
              <p>
                We don't announce vaporware. If it's listed here, it's real code being actively worked on.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/about" className="btn-secondary">Read our approach →</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
