import Reveal from "./motion/Reveal";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}

export default function SectionTitle({ eyebrow, title, description, align = "left", tone = "light" }: SectionTitleProps) {
  const center = align === "center";
  const dark = tone === "dark";
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : ""}>
      {eyebrow && <p className={`eyebrow mb-3 ${dark ? "!text-gold-400/80" : "!text-gold-600"}`}>{eyebrow}</p>}
      <h2 className={`text-[2rem] sm:text-[2.6rem] ${dark ? "!text-white" : ""}`}>{title}</h2>
      {description && (
        <p className={`mt-4 max-w-xl text-[16px] leading-relaxed ${center ? "mx-auto" : ""} ${dark ? "text-white/55" : "text-warm-500"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
