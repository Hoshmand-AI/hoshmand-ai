import Link from "next/link";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import { site } from "@/lib/site";

const principles = [
  {
    title: "Human-first AI",
    description: "AI should feel calm, predictable, and respectful of attention — not anxious or demanding.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    title: "Action over information",
    description: "The goal isn't more content — it's clearer paths to follow-through and completion.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Ethics by design",
    description: "Responsible AI isn't a feature — it's a foundation. Every product is built with fairness, transparency, and user trust in mind.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
      </svg>
    ),
  },
];

const steps = [
  { num: "01", title: "Identify real friction", description: "Start with a problem people actually have, not a solution looking for a problem." },
  { num: "02", title: "Build the smallest useful thing", description: "Ship early. Real-world use reveals more than any amount of pre-launch planning." },
  { num: "03", title: "Improve through use", description: "Listen to feedback patterns, observe real behavior, and iterate with intention." },
  { num: "04", title: "Earn trust over time", description: "Build products that respect attention and keep delivering long after the first week." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 py-24 sm:py-32">
        <Container>
          <p className="eyebrow text-white/40 mb-4">Independent AI studio</p>
          <h1
            className="max-w-3xl text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.12] mb-6"
            style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "white" }}
          >
            Responsible AI, built to turn digital clutter into action.
          </h1>
          <p className="max-w-xl text-[16px] leading-relaxed text-white/55 mb-10">
            {site.name} designs and ships practical AI products that reduce cognitive load and help people follow through — grounded in the principles of responsible, ethical AI.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="btn-primary">View Products</Link>
            <Link href="/about" className="btn-secondary" style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.15)" }}>
              Learn about us
            </Link>
          </div>
        </Container>
      </section>

      {/* Stats row */}
      <section className="border-b border-warm-200 bg-warm-100">
        <Container>
          <div className="flex flex-wrap gap-x-12 gap-y-6 py-8">
            {[
              { num: "1", label: "Product live" },
              { num: "iOS", label: "Platform" },
              { num: "2026", label: "Founded" },
              { num: "Virginia", label: "Based in" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold tabular-nums text-navy-950">{s.num}</div>
                <div className="caption mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Products */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Products"
            title="What we're building"
            description="Real products, shipped incrementally and improved through use."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ProductCard
              title="MindCue AI"
              tagline="Smart reminders from screenshots."
              status="Available on iOS"
              href="/mindcue"
              appStoreUrl={site.mindcueAppStoreUrl}
              bullets={[
                "AI-powered screenshot understanding",
                "Staggered reminder follow-ups (no pileups)",
                "Deep links to apps and actions",
                "Designed to reduce notification fatigue",
              ]}
            />
            {/* Placeholder */}
            <div className="card flex items-center justify-center p-8 opacity-60">
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

      {/* Principles */}
      <section className="border-t border-warm-200 bg-warm-100 py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Principles"
            title="Human-first, action-oriented, ethics-grounded."
            description="These principles guide every product we build."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {principles.map((p) => (
              <div key={p.title} className="card p-6">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-navy-900 text-gold-500">
                  {p.icon}
                </div>
                <h3 className="text-[15px] font-semibold text-navy-950 mb-2">{p.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-warm-500">{p.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How we work steps */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Approach"
            title="How we build."
            description="A simple, repeatable process for shipping responsible AI products."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.num} className="relative flex flex-col sm:pr-8">
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-5 hidden h-0.5 w-8 bg-warm-300 sm:block" />
                )}
                <div className="mb-3 text-2xl font-bold tabular-nums text-gold-500">{step.num}</div>
                <h4 className="text-[14px] font-semibold text-navy-950 mb-1.5">{step.title}</h4>
                <p className="text-[13px] leading-relaxed text-warm-500">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Founder */}
      <section className="border-t border-warm-200 py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <SectionTitle eyebrow="About" title="Built by an AI student and product builder." />
            </div>
            <div className="lg:col-span-3">
              <div className="card p-6 sm:p-8">
                <p className="text-[15px] leading-relaxed text-warm-600 mb-4">
                  Founded by{" "}
                  <span className="font-semibold text-navy-950">{site.founderName}</span>, {site.name} is focused on applying AI to real, everyday problems — starting with personal productivity and follow-through.
                </p>
                <p className="text-[15px] leading-relaxed text-warm-500 mb-6">
                  Currently studying the Ethics of AI, Ahmad brings a principled perspective to product development — ensuring that every tool built here is not just useful, but fair, transparent, and trustworthy.
                </p>

                {/* Current focus chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {["AI Ethics", "Responsible AI", "Human-Computer Interaction", "iOS Development"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-md border border-warm-200 bg-warm-50 px-3 py-1 text-[12px] font-medium text-warm-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-5 border-t border-warm-200">
                  <a
                    href={site.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13px] text-warm-500 hover:text-navy-950 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href={`mailto:${site.supportEmail}`}
                    className="inline-flex items-center gap-2 text-[13px] text-warm-500 hover:text-navy-950 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {site.supportEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Banner */}
      <section className="pb-20 sm:pb-24">
        <Container>
          <div className="rounded-lg bg-navy-900 px-8 py-14 text-center sm:px-12">
            <h2
              className="text-3xl sm:text-4xl mb-3"
              style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "white" }}
            >
              Responsible AI, built with intention.
            </h2>
            <p className="text-[14px] text-white/45 mb-8">
              Follow along as we build and ship — no hype, just products grounded in ethics and real use.
            </p>
            <div className="flex flex-col gap-3 items-center sm:flex-row sm:justify-center">
              <Link href="/products" className="btn-primary">View Products</Link>
              <Link
                href="/contact"
                className="btn-secondary"
                style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.15)" }}
              >
                Get in touch
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
