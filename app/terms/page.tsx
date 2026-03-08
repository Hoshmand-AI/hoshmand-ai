import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Terms of Service — MindCue",
  description: "Terms of Service for MindCue, a product by Hoshmand AI.",
};

const sections = [
  { title: "Acceptance of Terms", content: "By using MindCue, you agree to these Terms of Service. If you do not agree, please do not use the app." },
  { title: "Use of Service", content: "MindCue is provided for personal, non-commercial use. You agree not to use the app for any unlawful purpose or in a way that could harm Hoshmand AI or other users." },
  { title: "Intellectual Property", content: "The MindCue app and its content are owned by Hoshmand AI. You may not reproduce, distribute, or create derivative works without our explicit permission." },
  { title: "Disclaimer of Warranties", content: "MindCue is provided 'as is' without warranties of any kind. We make no guarantees about the accuracy, completeness, or reliability of the app." },
  { title: "Limitation of Liability", content: "Hoshmand AI shall not be liable for any indirect, incidental, or consequential damages arising from your use of MindCue." },
  { title: "Changes to Terms", content: "We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms." },
  { title: "Contact", content: "For questions about these Terms, contact us at support@hoshmand.ai" },
];

export default function TermsPage() {
  return (
    <>
      <section className="bg-navy-900 py-16 sm:py-20">
        <Container>
          <p className="eyebrow text-white/40 mb-4">MindCue App</p>
          <h1
            className="text-4xl mb-3"
            style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "white" }}
          >
            Terms of Service
          </h1>
          <p className="text-[13px] text-white/40">Last updated: January 1, 2025</p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl space-y-6">
            {sections.map((s) => (
              <div key={s.title} className="card p-6">
                <h3 className="text-[15px] font-semibold text-navy-950 mb-3">{s.title}</h3>
                <p className="text-[14px] leading-relaxed text-warm-600">{s.content}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[13px] text-warm-400">MindCue is a product by Hoshmand AI</p>
        </Container>
      </section>
    </>
  );
}
