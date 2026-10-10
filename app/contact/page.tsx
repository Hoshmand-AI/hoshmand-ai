import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import CopyEmail from "@/components/CopyEmail";
import Accordion from "@/components/ui/Accordion";
import Spotlight from "@/components/ui/Spotlight";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Hoshmand AI for support, partnerships, or collaboration.",
};

const topics = [
  { title: "Product support", desc: "Questions, issues, or feedback about MindCue or any of our products in development. Include your device and app version if something isn't working." },
  { title: "Partnerships", desc: "Integration opportunities, distribution, or co-marketing. Tell us a little about your organization and what you have in mind." },
  { title: "Press & media", desc: "Interviews, coverage, or product information requests. We're happy to share background on our products and our approach to responsible AI." },
  { title: "General", desc: "Anything else — we're happy to hear from you." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's connect."
        description="For support, partnerships, or collaboration — we'd love to hear from you."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <RevealGroup className="grid gap-5 md:grid-cols-2">
            <RevealItem className="h-full">
              <Spotlight className="card card-interactive h-full p-7">
                <div className="relative z-10 flex h-full flex-col">
                  <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-900 text-gold-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <p className="eyebrow mb-2">Email</p>
                  <a href={`mailto:${site.supportEmail}`} className="text-[20px] font-semibold tracking-tight text-navy-950 transition-colors hover:text-gold-600">
                    {site.supportEmail}
                  </a>
                  <p className="mt-2 text-[13.5px] text-warm-500">Typically replies within 24–48 hours.</p>
                  <div className="mt-auto flex gap-2 pt-6">
                    <a href={`mailto:${site.supportEmail}`} className="btn-dark !h-9 !px-4 text-[12.5px]">Write an email</a>
                    <CopyEmail email={site.supportEmail} />
                  </div>
                </div>
              </Spotlight>
            </RevealItem>

            <RevealItem className="h-full">
              <Spotlight className="card card-interactive h-full p-7">
                <div className="relative z-10 flex h-full flex-col">
                  <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-900 text-gold-500">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </span>
                  <p className="eyebrow mb-2">LinkedIn</p>
                  <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[20px] font-semibold tracking-tight text-navy-950 transition-colors hover:text-gold-600">
                    {site.founderName}
                  </a>
                  <p className="mt-2 text-[13.5px] text-warm-500">Founder, {site.name}.</p>
                  <div className="mt-auto pt-6">
                    <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary !h-9 !px-4 text-[12.5px]">
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </Spotlight>
            </RevealItem>
          </RevealGroup>

          <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow mb-3 !text-gold-600">Topics</p>
              <h2 className="text-[2rem] sm:text-[2.4rem]">What we can help with.</h2>
              <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-warm-500">Pick a topic to see what to include so we can help faster.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <Accordion
                defaultOpen={0}
                items={topics.map((t) => ({ title: t.title, content: <p>{t.desc}</p> }))}
              />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
