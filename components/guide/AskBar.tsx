"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ASK_EVENT } from "./Guide";

const EXAMPLES = [
  "Help me with my inbox",
  "Explain my construction schedule",
  "Keep track of my messages",
  "How do I get an invite?",
];

// Hero prompt: type what you want to get done and the guide takes it from there.
export default function AskBar() {
  const [value, setValue] = useState("");
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || value) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % EXAMPLES.length), 2600);
    return () => window.clearInterval(t);
  }, [reduce, value]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: value.trim() || EXAMPLES[i] }));
    setValue("");
  }

  return (
    <form
      onSubmit={submit}
      className="group relative mx-auto flex w-full max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] p-1.5 pl-5 backdrop-blur transition-colors focus-within:border-gold-500/70 hover:border-white/25 lg:mx-0"
    >
      <label htmlFor="hero-ask" className="sr-only">What do you want to get done?</label>
      <div className="relative min-w-0 flex-1">
        <input
          id="hero-ask"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          className="relative z-10 w-full bg-transparent py-2 text-[15px] text-white focus:outline-none"
        />
        {!value && (
          <span className="pointer-events-none absolute inset-0 flex items-center overflow-hidden text-[15px] text-white/60" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={i}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.45 }}
                className="truncate"
              >
                {EXAMPLES[i]}
              </motion.span>
            </AnimatePresence>
          </span>
        )}
      </div>
      <button type="submit" className="btn-primary !h-10 shrink-0 !px-4 text-[13.5px]">
        Ask
        <kbd className="hidden rounded border border-navy-950/20 px-1 font-sans text-[10px] font-semibold sm:inline">⌘K</kbd>
      </button>
    </form>
  );
}
