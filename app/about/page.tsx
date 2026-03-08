import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import { site } from "@/lib/site";
import Link from "next/link";

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
      {/* Hero */}
      <section className="bg-navy-900 py-20 sm:py-28">
        <Container>
          <p className="eyebrow text-white/40 mb-4">About</p>
          <h1
            className="max-w-2xl text-4xl sm:text-5xl mb-5"
            style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "white" }}
          >
            An independent AI studio.
          </h1>
          <p className="max-w-xl text-[16px] leading-relaxed text-white/55">
            Focused on building responsible, human-centered products — guided by a principled approach to AI ethics and a commitment to earning user trust.
          </p>
        </Container>
      </section>

      {/* Story + Vision */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionTitle eyebrow="Story" title="Why we started this." />
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-warm-600">
                <p>
                  Founded by{" "}
                  <span className="font-semibold text-navy-950">{site.founderName}</span> — an AI student, product builder, and student of AI ethics.
                </p>
                <p>
                  We started {site.name} because we believe AI should support attention, not compete for it. Too many apps fight for our focus. We want to build tools that help people get things done and then get out of the way.
                </p>
                <p>
                  Rather than chasing hype, our approach is simple: ship real products, learn from real usage, and earn trust through transparency.
                </p>
              </div>
            </div>

            <div>
              <SectionTitle eyebrow="Vision" title="Where this is going." />
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-warm-600">
                <p>
                  Long-term, we're building toward a company people associate with responsible, ethical AI — tools that respect attention and deliver real value without compromising user trust.
                </p>
                <p>
                  Every product built here is informed by ongoing study of AI ethics, responsible design, and the real-world consequences of deploying intelligent systems.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* AI Ethics Focus */}
      <section className="border-t border-warm-200 bg-warm-100 py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <SectionTitle
                eyebrow="Current Focus"
                title="Studying the Ethics of AI."
              />
              <p className="mt-4 text-[15px] leading-relaxed text-warm-600">
                Ahmad is currently studying the Ethics of AI, exploring the moral frameworks, societal impacts, and design responsibilities that come with building intelligent systems.
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-warm-500">
                This informs every product decision at Hoshmand AI — not as a compliance checkbox, but as a genuine commitment to building technology that is fair, transparent, and accountable.
              </p>
            </div>

            <div className="lg:col-span-3">
              <div className="grid gap-4 sm:grid-cols-2">
                {ethicsAreas.map((area) => (
                  <div key={area.title} className="card p-5">
                    <div className="mb-2 h-0.5 w-6 rounded-full bg-gold-500" />
                    <h3 className="text-[14px] font-semibold text-navy-950 mb-1.5">{area.title}</h3>
                    <p className="text-[13px] leading-relaxed text-warm-500">{area.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="border-t border-warm-200 py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Approach"
            title="How we work."
            description="Simple principles that guide every decision."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="card p-6">
                <span className="text-3xl font-bold text-warm-200 select-none">{v.num}</span>
                <h3 className="mt-3 text-[15px] font-semibold text-navy-950 mb-2">{v.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-warm-500">{v.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-warm-200 py-20 sm:py-24">
        <Container>
          <div className="card mx-auto max-w-2xl p-8 sm:p-10 text-center bg-warm-50">
            <h2 className="text-2xl mb-3" style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "#0A1628" }}>
              Let's connect
            </h2>
            <p className="text-[14px] text-warm-500 mb-8">
              Interested in products, partnerships, AI ethics discussions, or just want to say hello?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`mailto:${site.supportEmail}`} className="btn-primary">Email us</a>
              <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                LinkedIn
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
