import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "MindCue AI — Smart reminders from screenshots",
  description: "MindCue AI helps you follow through on what you save — links, messages, calls, and tasks — with calm reminders that don't nag. Available on the App Store.",
};

const features = [
  {
    title: "Turn your screenshots into actions",
    subtitle: "Welcome to MindCue AI",
    description: "We help you remember and act on everything you capture. No more forgotten screenshots.",
    image: "/mindcue-screen-1.png",
  },
  {
    title: "AI-Powered Analysis",
    subtitle: "Smart screenshot understanding",
    description: "Our AI recognizes contacts, products, videos, and more from your screenshots automatically.",
    image: "/mindcue-screen-2.png",
  },
  {
    title: "Smart Reminders",
    subtitle: "Never forget to take action",
    description: "Get reminded at the right time to call, buy, watch, or complete any task.",
    image: "/mindcue-screen-3.png",
  },
  {
    title: "Get Things Done",
    subtitle: "From screenshot to completion",
    description: "One tap to call, message, buy, or open any content from your reminders.",
    image: "/mindcue-screen-4.png",
  },
];

const additionalFeatures = [
  {
    title: "Staggered follow-ups",
    description: "No morning notification pileups. Reminders are spaced out intelligently throughout your day.",
  },
  {
    title: "Deep links to apps",
    description: "Jump directly to the right app or action. Open that message, call that contact, visit that link.",
  },
  {
    title: "Privacy-first design",
    description: "Your screenshots stay on your device. We don't store or analyze your data on our servers.",
  },
];

export default function MindCuePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 py-20 sm:py-28">
        <Container>
          <div className="flex flex-col items-center text-center">
            <div className="mb-8">
              <Image
                src="/mindcue-logo.png"
                alt="MindCue AI"
                width={100}
                height={100}
                className="rounded-[24px] shadow-xl"
              />
            </div>
            <p className="eyebrow text-white/40 mb-4">iOS App · Free to Download</p>
            <h1
              className="max-w-2xl text-4xl sm:text-5xl mb-5"
              style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "white" }}
            >
              Turn your screenshots into actions
            </h1>
            <p className="max-w-xl text-[16px] leading-relaxed text-white/55 mb-10">
              MindCue AI helps you remember and act on everything you capture — links, messages, calls, and tasks — with calm reminders that don't nag.
            </p>

            {/* App Store CTA */}
            <a
              href={site.mindcueAppStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-lg border border-white/15 bg-white/8 px-6 py-3.5 transition-colors hover:bg-white/12"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.05 14.5c-.03-3.04 2.49-4.52 2.6-4.59-1.42-2.07-3.62-2.35-4.4-2.38-1.87-.19-3.65 1.1-4.6 1.1-.95 0-2.41-1.08-3.97-1.05-2.04.03-3.92 1.18-4.97 3-2.13 3.69-.55 9.15 1.53 12.14 1.01 1.46 2.21 3.1 3.79 3.04 1.52-.06 2.1-.98 3.94-.98 1.84 0 2.37.98 3.99.95 1.63-.03 2.67-1.49 3.67-2.96.8-1.14 1.35-2.4 1.7-3.72-3.72-1.42-3.72-6.56-.28-7.55zM14.1 5.04c.84-1.02 1.41-2.44 1.25-3.86-1.21.05-2.67.81-3.54 1.83-.77.89-1.45 2.31-1.27 3.67 1.35.1 2.73-.68 3.56-1.64z" fill="white"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-white/60 leading-none mb-0.5">Download on the</div>
                <div className="text-[16px] font-semibold text-white leading-none">App Store</div>
              </div>
            </a>

            <p className="mt-4 text-[12px] text-white/35">Free · Available on iPhone · iOS 16+</p>
          </div>
        </Container>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="How it works"
            title="From screenshot to action in seconds"
            description="See how MindCue AI transforms the way you handle screenshots."
          />

          <div className="mt-16 space-y-20">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex flex-col items-center gap-12 lg:flex-row ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Phone */}
                <div className="flex-shrink-0">
                  <div className="relative mx-auto w-[240px] sm:w-[260px]">
                    <div className="relative overflow-hidden rounded-[2.5rem] border-[7px] border-warm-300 bg-warm-200 shadow-lg">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={260}
                        height={560}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <p className="eyebrow mb-3 text-gold-600">{feature.subtitle}</p>
                  <h3
                    className="text-2xl sm:text-3xl mb-4"
                    style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "#0A1628" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-warm-500 max-w-md">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Additional Features */}
      <section className="border-t border-warm-200 bg-warm-100 py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="Features"
            title="Designed for focus"
            description="Every feature is built to reduce cognitive load — not increase it."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {additionalFeatures.map((feature) => (
              <div key={feature.title} className="card p-6">
                <div className="mb-4 h-0.5 w-8 rounded-full bg-gold-500" />
                <h3 className="text-[15px] font-semibold text-navy-950 mb-2">{feature.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-warm-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Download CTA */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="card p-8 sm:p-10 text-center bg-warm-50">
              <div className="mx-auto mb-6 w-14">
                <Image
                  src="/mindcue-logo.png"
                  alt="MindCue AI"
                  width={56}
                  height={56}
                  className="rounded-xl"
                />
              </div>
              <h2
                className="text-2xl sm:text-3xl mb-3"
                style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "#0A1628" }}
              >
                Available now on iPhone
              </h2>
              <p className="text-[14px] text-warm-500 mb-8 max-w-sm mx-auto">
                Download MindCue AI for free and start turning your screenshots into completed actions.
              </p>

              {/* App Store Button */}
              <div className="flex flex-col items-center gap-4">
                <a
                  href={site.mindcueAppStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-lg bg-navy-900 px-6 py-3.5 transition-colors hover:bg-navy-800"
                >
                  <svg width="22" height="26" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.05 14.5c-.03-3.04 2.49-4.52 2.6-4.59-1.42-2.07-3.62-2.35-4.4-2.38-1.87-.19-3.65 1.1-4.6 1.1-.95 0-2.41-1.08-3.97-1.05-2.04.03-3.92 1.18-4.97 3-2.13 3.69-.55 9.15 1.53 12.14 1.01 1.46 2.21 3.1 3.79 3.04 1.52-.06 2.1-.98 3.94-.98 1.84 0 2.37.98 3.99.95 1.63-.03 2.67-1.49 3.67-2.96.8-1.14 1.35-2.4 1.7-3.72-3.72-1.42-3.72-6.56-.28-7.55zM14.1 5.04c.84-1.02 1.41-2.44 1.25-3.86-1.21.05-2.67.81-3.54 1.83-.77.89-1.45 2.31-1.27 3.67 1.35.1 2.73-.68 3.56-1.64z" fill="white"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] text-white/60 leading-none mb-0.5">Download on the</div>
                    <div className="text-[15px] font-semibold text-white leading-none">App Store</div>
                  </div>
                </a>
                <p className="text-[12px] text-warm-400">Free · iPhone · iOS 16+</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
