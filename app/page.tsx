import Link from "next/link";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import HeroText, { HeroFade } from "@/components/motion/HeroText";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import Spotlight from "@/components/ui/Spotlight";
import CountUp from "@/components/ui/CountUp";
import ProductShowcase from "@/components/home/ProductShowcase";
import Steps from "@/components/home/Steps";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";

const principles = [
  {
    title: "Human-first AI",
    description: "AI should feel calm, predictable, and respectful of attention — not anxious or demanding.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    title: "Action over information",
    description: "The goal isn't more content — it's clearer paths to follow-through and completion.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Ethics by design",
    description: "Responsible AI isn't a feature — it's a foundation. Every product is built with fairness, transparency, and user trust in mind.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
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

const arrow = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function Home() {
  const showcase = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    status: p.status,
    highlights: p.highlights,
    href: p.customPage ? `/${p.slug}` : `/products/${p.slug}`,
    appStoreUrl: p.appStoreUrl,
    appUrl: p.appUrl,
    access: p.access,
  }));
  const shippingCount = projects.filter((p) => p.status === "shipping").length;

  return (
    <>
      {/* Hero */}
      <section className="hero-surface -mt-16 pb-28 pt-40 sm:pb-36 sm:pt-48">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <HeroFade delay={0}>
              <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-medium text-white/70 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                Independent AI studio · {projects.length} products
              </span>
            </HeroFade>
            <HeroText
              text="Responsible AI, built to turn digital clutter into action."
              className="display !text-white"
              delay={0.1}
            />
            <HeroFade delay={0.55}>
              <p className="mx-auto mt-7 max-w-2xl text-[17px] leading-relaxed text-white/60 sm:text-[19px]">
                {site.name} designs and ships practical AI products that reduce cognitive load and help people follow through — grounded in the principles of responsible, ethical AI.
              </p>
            </HeroFade>
            <HeroFade delay={0.7}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/products" className="btn-primary !h-12 !px-7 text-[15px]">
                  Explore products {arrow}
                </Link>
                <Link href="/about" className="btn-glass !h-12 !px-7 text-[15px]">
                  Learn about us
                </Link>
              </div>
            </HeroFade>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="border-b border-warm-200 bg-white">
        <Container>
          <RevealGroup className="grid grid-cols-2 divide-warm-200 py-10 sm:grid-cols-4 sm:divide-x">
            {[
              { num: String(projects.length), label: "Products" },
              { num: String(shippingCount), label: "On the App Store" },
              { num: "2026", label: "Founded" },
              { num: "Virginia", label: "Based in" },
            ].map((s) => (
              <RevealItem key={s.label} className="px-2 py-3 text-center">
                <CountUp value={s.num} className="block font-serif text-[2.4rem] leading-none tabular-nums text-navy-950" />
                <div className="caption mt-2">{s.label}</div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* Products */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionTitle
            align="center"
            eyebrow="Products"
            title="What we're building."
            description="One app on the App Store, four in active development. Tap through to see each one."
          />
          <Reveal className="mt-12" delay={0.1}>
            <ProductShowcase products={showcase} />
          </Reveal>
        </Container>
      </section>

      {/* Principles */}
      <section className="border-y border-warm-200 bg-warm-100 py-24 sm:py-32">
        <Container>
          <SectionTitle
            eyebrow="Principles"
            title="Human-first, action-oriented, ethics-grounded."
            description="These principles guide every product we build."
          />
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {principles.map((p) => (
              <RevealItem key={p.title} className="h-full">
                <Spotlight className="card card-interactive group h-full p-7">
                  <div className="relative z-10">
                    <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-900 text-gold-500 shadow-[var(--shadow-md)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]">
                      {p.icon}
                    </div>
                    <h3 className="mb-2 text-[17px] font-semibold text-navy-950">{p.title}</h3>
                    <p className="text-[14.5px] leading-relaxed text-warm-500">{p.description}</p>
                  </div>
                </Spotlight>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* How we build */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionTitle
            eyebrow="Approach"
            title="How we build."
            description="A simple, repeatable process for shipping responsible AI products. Select a step."
          />
          <Reveal className="mt-12" delay={0.1}>
            <Steps steps={steps} />
          </Reveal>
        </Container>
      </section>

      {/* Founder */}
      <section className="border-t border-warm-200 bg-warm-100 py-24 sm:py-32">
        <Container>
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <SectionTitle eyebrow="About" title="Built by an AI student and product builder." />
            </div>
            <Reveal className="lg:col-span-3" delay={0.1}>
              <div className="card p-7 sm:p-9">
                <p className="mb-4 text-[16px] leading-relaxed text-warm-600">
                  Founded by <span className="font-semibold text-navy-950">{site.founderName}</span>, {site.name} is focused on applying AI to real, everyday problems — starting with personal productivity and follow-through.
                </p>
                <p className="mb-7 text-[16px] leading-relaxed text-warm-500">
                  Currently studying the Ethics of AI, Ahmad brings a principled perspective to product development — ensuring that every tool built here is not just useful, but fair, transparent, and trustworthy.
                </p>
                <div className="mb-7 flex flex-wrap gap-2">
                  {["AI Ethics", "Responsible AI", "Human-Computer Interaction", "iOS Development"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-block cursor-default rounded-full border border-warm-200 bg-warm-50 px-3.5 py-1.5 text-[12.5px] font-medium text-warm-600 transition-colors duration-200 hover:border-gold-500/40 hover:bg-gold-100 hover:text-navy-950"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 border-t border-warm-200 pt-6">
                  <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary !h-10">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                  <a href={`mailto:${site.supportEmail}`} className="btn-secondary !h-10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {site.supportEmail}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-28">
        <Container>
          <Reveal>
            <div className="hero-surface rounded-[2rem] px-8 py-20 text-center sm:px-12">
              <h2 className="mx-auto max-w-2xl text-[2.2rem] !text-white sm:text-[3rem]">
                Responsible AI, built with intention.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[16px] text-white/55">
                Follow along as we build and ship — no hype, just products grounded in ethics and real use.
              </p>
              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/products" className="btn-primary !h-12 !px-7">Explore products {arrow}</Link>
                <Link href="/contact" className="btn-glass !h-12 !px-7">Get in touch</Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
