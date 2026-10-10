import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import LegalSections from "@/components/LegalSections";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Privacy Policy — MindCue",
  description: "Privacy Policy for MindCue, a product by Hoshmand AI. Learn how we handle your data.",
};

const sections = [
  { title: "Data Collection", content: "MindCue processes your screenshots locally on your device to help you create reminders. We do not collect, store, or transmit your screenshots or personal data to any external servers." },
  { title: "Photo Library Access", content: "We request access to your photo library solely to detect and display your recent screenshots within the app. Your photos never leave your device." },
  { title: "Notifications", content: "We use local notifications to remind you about your saved items. These notifications are managed entirely on your device." },
  { title: "Contacts Access", content: "If you grant contacts access, we use it only to help identify contact names in your screenshots for easier reminder creation. Your contacts are never uploaded or shared." },
  { title: "AI Processing", content: "Screenshot analysis is performed using on-device processing when possible. If you configure an external AI service, only the specific screenshot being analyzed is sent securely for processing." },
  { title: "Data Storage", content: "All your reminders and app data are stored locally on your device. We do not have access to your data." },
  { title: "Contact Us", content: "If you have any questions about this Privacy Policy, please contact us at support@hoshmand.ai" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="MindCue App" title="Privacy Policy" description="Last updated: January 1, 2025" />
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
