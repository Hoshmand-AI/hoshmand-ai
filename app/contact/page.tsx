import type { Metadata } from "next";
import Container from "@/components/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Hoshmand AI for support, partnerships, or collaboration.",
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-navy-900 py-20 sm:py-28">
        <Container>
          <p className="eyebrow text-white/40 mb-4">Contact</p>
          <h1
            className="max-w-xl text-4xl sm:text-5xl mb-5"
            style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "white" }}
          >
            Let's connect.
          </h1>
          <p className="max-w-md text-[15px] leading-relaxed text-white/55">
            For support, partnerships, or collaboration — we'd love to hear from you.
          </p>
        </Container>
      </section>

      {/* Contact card */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 max-w-3xl">
            {/* Contact details */}
            <div>
              <h2
                className="text-2xl mb-8"
                style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "#0A1628" }}
              >
                Get in touch
              </h2>

              <div className="space-y-6">
                <div>
                  <p className="eyebrow mb-2">Email</p>
                  <a
                    href={`mailto:${site.supportEmail}`}
                    className="inline-flex items-center gap-2.5 text-[15px] font-medium text-navy-950 hover:text-gold-600 transition-colors"
                  >
                    <svg className="h-4 w-4 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {site.supportEmail}
                  </a>
                </div>

                <div className="border-t border-warm-200" />

                <div>
                  <p className="eyebrow mb-2">LinkedIn</p>
                  <a
                    href={site.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-[15px] font-medium text-navy-950 hover:text-gold-600 transition-colors"
                  >
                    <svg className="h-4 w-4 text-warm-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    {site.founderName}
                  </a>
                </div>

                <div className="border-t border-warm-200" />

                <div className="rounded-md bg-warm-100 border border-warm-200 p-4">
                  <p className="text-[13px] text-warm-500">
                    Response time is typically within 24–48 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* What to reach out about */}
            <div>
              <h2
                className="text-2xl mb-8"
                style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "#0A1628" }}
              >
                What we can help with
              </h2>
              <ul className="space-y-4">
                {[
                  { title: "Product support", desc: "Questions, issues, or feedback about MindCue or other products." },
                  { title: "Partnerships", desc: "Integration opportunities, distribution, or co-marketing." },
                  { title: "Press & media", desc: "Interviews, coverage, or product information requests." },
                  { title: "General", desc: "Anything else — we're happy to hear from you." },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3 py-3 border-b border-warm-200 last:border-0">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500 mt-2" />
                    <div>
                      <div className="text-[14px] font-semibold text-navy-950">{item.title}</div>
                      <div className="text-[13px] text-warm-500 mt-0.5">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
