import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import LegalSections from "@/components/LegalSections";
import Reveal from "@/components/motion/Reveal";

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
      <PageHero eyebrow="MindCue App" title="Terms of Service" description="Last updated: January 1, 2025" />
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal className="max-w-3xl">
            <LegalSections sections={sections} />
            <p className="mt-10 text-[13px] text-warm-400">MindCue is a product by Hoshmand AI</p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
