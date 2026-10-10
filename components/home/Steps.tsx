"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface Step {
  num: string;
  title: string;
  description: string;
}

// Interactive stepper: a gold progress line fills to the selected step.
export default function Steps({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <ol className="relative">
        <div className="absolute bottom-6 left-[19px] top-6 w-px bg-warm-300" aria-hidden="true" />
        <motion.div
          className="absolute left-[19px] top-6 w-px origin-top bg-gold-500"
          style={{ height: "calc(100% - 3rem)" }}
          animate={{ scaleY: steps.length > 1 ? active / (steps.length - 1) : 1 }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          aria-hidden="true"
        />
        {steps.map((step, i) => {
          const selected = i === active;
          const done = i < active;
          return (
            <li key={step.num}>
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-pressed={selected}
                className="group relative flex w-full items-center gap-5 rounded-2xl py-4 pr-4 text-left"
              >
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold tabular-nums transition-all duration-500 ${
                    selected
                      ? "scale-110 border-gold-500 bg-gold-500 text-navy-950 shadow-[0_0_0_6px_rgba(200,150,62,0.15)]"
                      : done
                        ? "border-gold-500 bg-gold-100 text-gold-600"
                        : "border-warm-300 bg-warm-50 text-warm-500 group-hover:border-warm-400"
                  }`}
                >
                  {step.num}
                </span>
                <span className={`text-[17px] font-semibold tracking-tight transition-colors duration-300 ${selected ? "text-navy-950" : "text-warm-500 group-hover:text-warm-700"}`}>
                  {step.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="relative min-h-[220px] overflow-hidden rounded-[1.75rem] hero-surface p-8 sm:p-10" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
            transition={{ type: "spring", bounce: 0, duration: 0.45 }}
          >
            <span className="font-serif text-[88px] leading-none text-gold-500/90">{steps[active].num}</span>
            <h3 className="mt-4 text-[24px] font-semibold !text-white">{steps[active].title}</h3>
            <p className="mt-3 max-w-md text-[16px] leading-relaxed text-white/60">{steps[active].description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
