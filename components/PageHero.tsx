import type { ReactNode } from "react";
import Container from "./Container";
import HeroText, { HeroFade } from "./motion/HeroText";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  above?: ReactNode;
  align?: "left" | "center";
}

// Shared hero: sits under the translucent navbar, headline rises in word by word.
export default function PageHero({ eyebrow, title, description, children, above, align = "left" }: PageHeroProps) {
  const center = align === "center";
  return (
    <section className="hero-surface -mt-16 pb-20 pt-36 sm:pb-24 sm:pt-44">
      <Container>
        <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {above && <HeroFade delay={0}>{above}</HeroFade>}
          {eyebrow && (
            <HeroFade delay={0}>
              <p className="eyebrow mb-5 !text-gold-400/80">{eyebrow}</p>
            </HeroFade>
          )}
          <HeroText text={title} className="text-[2.6rem] !text-white sm:text-[3.6rem] lg:text-[4rem] !leading-[1.04] tracking-[-0.025em]" delay={0.05} />
          {description && (
            <HeroFade delay={0.4}>
              <p className={`mt-6 max-w-xl text-[17px] leading-relaxed text-white/60 ${center ? "mx-auto" : ""}`}>{description}</p>
            </HeroFade>
          )}
          {children && <HeroFade delay={0.55}>{children}</HeroFade>}
        </div>
      </Container>
    </section>
  );
}
