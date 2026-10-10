import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import PageHero from "@/components/PageHero";
import Accordion from "@/components/ui/Accordion";
import Spotlight from "@/components/ui/Spotlight";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Hoshmand AI is an independent AI studio focused on building responsible, human-centered AI products grounded in AI ethics.",
};

const values = [
  {
    num: "01",
    title: "Build real products",
    description: "Ship working software that solves real problems. Ideas are worthless without execution.",
  },
  {
    num: "02",
    title: "Learn from real users",
    description: "Listen to feedback, observe usage patterns, and iterate based on what actually helps people.",
  },
  {
    num: "03",
    title: "Earn trust through transparency",
    description: "Be honest about what products can and can't do. Never overpromise or hide limitations.",
  },
];

const ethicsAreas = [
  {
    title: "Fairness & Bias",
    description: "Understanding how AI systems can encode and amplify societal biases, and how to design against it.",
  },
  {
    title: "Transparency & Explainability",
    description: "Building AI that users can understand, question, and trust — not black boxes they're forced to rely on.",
  },
  {
    title: "Privacy & Autonomy",
    description: "Designing systems that respect user data, give people meaningful control, and don't manipulate behavior.",
  },
  {
    title: "Accountability",
    description: "Ensuring that when AI causes harm, there are clear lines of responsibility and paths to recourse.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="An independent AI studio."
        description="Focused on building responsible, human-centered products — guided by a principled approach to AI ethics and a commitment to earning user trust."
      />

      {/* Story + Vision */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionTitle eyebrow="Story" title="Why we started this." />
              <Reveal delay={0.1} className="mt-6 space-y-4 text-[16px] leading-relaxed text-warm-600">
                <p>
                  Founded by <span className="font-semibold text-navy-950">{site.founderName}</span> — an AI student, product builder, and student of AI ethics.
                </p>
                <p>
                  We started {site.name} because we believe AI should support attention, not compete for it. Too many apps fight for our focus. We want to build tools that help people get things done and then get out of the way.
                </p>
                <p>
                  Rather than chasing hype, our approach is simple: ship real products, learn from real usage, and earn trust through transparency.
                </p>
              </Reveal>
            </div>
            <div>
              <SectionTitle eyebrow="Vision" title="Where this is going." />
              <Reveal delay={0.1} className="mt-6 space-y-4 text-[16px] leading-relaxed text-warm-600">
                <p>
                  Long-term, we're building toward a company people associate with responsible, ethical AI — tools that respect attention and deliver real value without compromising user trust.
                </p>
                <p>
                  Every product built here is informed by ongoing study of AI ethics, responsible design, and the real-world consequences of deploying intelligent systems.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Quote band */}
      <section className="hero-surface py-24 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="font-serif text-[1.9rem] leading-[1.2] tracking-[-0.015em] text-white sm:text-[2.6rem]">
              &ldquo;AI should support attention, <span className="text-gold-400">not compete for it.</span>&rdquo;
            </p>
            <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.12em] text-white/40">{site.founderName}</p>
          </Reveal>
        </Container>
      </section>

      {/* AI Ethics Focus */}
      <section className="border-b border-warm-200 bg-warm-100 py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <SectionTitle eyebrow="Current Focus" title="Studying the Ethics of AI." />
              <Reveal delay={0.1}>
                <p className="mt-5 text-[16px] leading-relaxed text-warm-600">
                  Ahmad is currently studying the Ethics of AI, exploring the moral frameworks, societal impacts, and design responsibilities that come with building intelligent systems.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-warm-500">
                  This informs every product decision at Hoshmand AI — not as a compliance checkbox, but as a genuine commitment to building technology that is fair, transparent, and accountable.
                </p>
              </Reveal>
            </div>
            <Reveal className="lg:col-span-3" delay={0.15}>
              <Accordion
                variant="card"
                defaultOpen={0}
                items={ethicsAreas.map((a) => ({
                  title: a.title,
                  meta: <span className="h-2 w-2 rounded-full bg-gold-500" />,
                  content: <p>{a.description}</p>,
                }))}
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionTitle eyebrow="Approach" title="How we work." description="Simple principles that guide every decision." />
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((v) => (
              <RevealItem key={v.title} className="h-full">
                <Spotlight className="card card-interactive group h-full overflow-hidden p-7">
                  <div className="relative z-10">
                    <span className="block select-none font-serif text-[64px] leading-none text-warm-200 transition-colors duration-500 group-hover:text-gold-500">
                      {v.num}
                    </span>
                    <h3 className="mb-2 mt-5 text-[17px] font-semibold text-navy-950">{v.title}</h3>
                    <p className="text-[14.5px] leading-relaxed text-warm-500">{v.description}</p>
                  </div>
                </Spotlight>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <Reveal>
            <div className="card mx-auto max-w-3xl p-10 text-center sm:p-14">
              <h2 className="text-[2rem] sm:text-[2.4rem]">Let&apos;s connect.</h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] text-warm-500">
                Interested in products, partnerships, AI ethics discussions, or just want to say hello?
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href={`mailto:${site.supportEmail}`} className="btn-primary">Email us</a>
                <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">LinkedIn</a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
