import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/motion/Reveal";
import tokens from "@/design/tokens.json";

export const metadata: Metadata = {
  title: "Design system",
  description: "The colour and type system behind Hoshmand AI: named shades, checked for contrast.",
  alternates: { canonical: "/design" },
};

// WCAG contrast, so each swatch can show how it reads against white.
function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const scales: { name: keyof typeof tokens; brand: string; note: string }[] = [
  { name: "primary", brand: "Navy", note: "One brand colour, ten shades. Surfaces, headings and dark sections." },
  { name: "neutral", brand: "Warm grey", note: "Backgrounds, borders and body text." },
  { name: "accent", brand: "Gold", note: "Buttons, highlights and the italic accent." },
  { name: "success", brand: "Green", note: "Confirmations and live status." },
  { name: "warning", brand: "Amber", note: "Things that need attention." },
  { name: "error", brand: "Red", note: "Problems and failed actions." },
];

const type = [
  { token: "display", sample: "Responsible AI", cls: "font-serif text-display text-navy-950", use: "Hero headlines. DM Serif Display." },
  { token: "heading", sample: "What we're building.", cls: "font-serif text-heading text-navy-950", use: "Section titles. DM Serif Display." },
  { token: "accent", sample: "into action.", cls: "font-serif text-heading italic text-gold-700", use: "One italic accent per headline, never more." },
  { token: "title", sample: "Human-first AI", cls: "text-title font-semibold text-navy-950", use: "Card titles. DM Sans 600." },
  { token: "lead", sample: "Practical AI products that help people follow through.", cls: "text-lead text-warm-600", use: "Intro paragraphs." },
  { token: "body", sample: "Every product keeps a person in control.", cls: "text-body text-warm-600", use: "Body text. DM Sans 400." },
  { token: "small", sample: "No spam. One email when it's ready.", cls: "text-small text-warm-500", use: "Supporting text." },
  { token: "caption", sample: "IN DEVELOPMENT", cls: "text-caption font-semibold uppercase text-warm-500", use: "Labels. Never below 12px." },
];

export default function DesignPage() {
  return (
    <>
      <PageHero
        eyebrow="Design system"
        title="Don't pick colours. Build a system."
        description="Every colour and text size on this site has a name and has been checked for contrast. Nothing is chosen by eye."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <Reveal>
            <p className="eyebrow mb-3 !text-gold-700">Colour</p>
            <h2 className="text-heading">Six scales, named.</h2>
            <p className="mt-4 max-w-2xl text-body text-warm-600">
              Each swatch shows its token name, its value and its contrast against white. Text needs at least 4.5:1, so text colours come from the darker shades.
            </p>
          </Reveal>

          <div className="mt-12 space-y-12">
            {scales.map((scale) => (
              <Reveal key={scale.name}>
                <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-title font-semibold capitalize text-navy-950">{scale.name}</h3>
                  <span className="text-small text-warm-500">{scale.brand}. {scale.note}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-10">
                  {Object.entries(tokens[scale.name]).map(([shade, hex]) => {
                    const ratio = contrast(hex, "#FFFFFF");
                    const dark = ratio >= 4.5;
                    return (
                      <div key={shade} className="overflow-hidden rounded-xl border border-warm-200 bg-white">
                        <div className="flex h-16 items-end p-2" style={{ backgroundColor: hex }}>
                          <span className={`text-[12px] font-semibold ${dark ? "text-white" : "text-navy-950"}`}>{shade}</span>
                        </div>
                        <div className="p-2">
                          <p className="truncate text-[12px] font-medium text-navy-950">{scale.name}/{shade}</p>
                          <p className="text-[12px] tabular-nums text-warm-500">{hex}</p>
                          <p className={`mt-1 text-[12px] font-semibold tabular-nums ${dark ? "text-success-700" : "text-warm-500"}`}>
                            {ratio.toFixed(1)}:1 {dark ? "text" : "fill"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-warm-200 bg-warm-100 py-20 sm:py-24">
        <Container>
          <Reveal>
            <p className="eyebrow mb-3 !text-gold-700">Type</p>
            <h2 className="text-heading">Two typefaces, eight sizes.</h2>
            <p className="mt-4 max-w-2xl text-body text-warm-600">
              DM Serif Display for headlines, DM Sans for everything else. Letter spacing tightens as the size grows.
            </p>
          </Reveal>
          <div className="mt-10 divide-y divide-warm-200 rounded-2xl border border-warm-200 bg-white">
            {type.map((t) => (
              <div key={t.token} className="grid gap-2 p-5 sm:grid-cols-[150px_1fr] sm:items-baseline sm:gap-6">
                <div>
                  <p className="text-small font-semibold text-navy-950">{t.token}</p>
                  <p className="text-[12px] text-warm-500">{t.use}</p>
                </div>
                <p className={`min-w-0 break-words ${t.cls}`}>{t.sample}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
