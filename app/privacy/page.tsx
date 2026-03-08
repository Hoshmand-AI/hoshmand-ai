import type { Metadata } from "next";
import Container from "@/components/Container";

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
      <section className="bg-navy-900 py-16 sm:py-20">
        <Container>
          <p className="eyebrow text-white/40 mb-4">MindCue App</p>
          <h1
            className="text-4xl mb-3"
            style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "white" }}
          >
            Privacy Policy
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
