"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type State = "idle" | "open" | "loading" | "done" | "error";

// A single pill that morphs: "Notify me" → email field → confirmation.
export default function ProjectNotifyForm({ slug, startOpen = false, label = "Notify me when it ships", variant = "dark" }: { slug: string; startOpen?: boolean; label?: string; variant?: "dark" | "secondary" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>(startOpen ? "open" : "idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === "open" && !startOpen) inputRef.current?.focus();
  }, [state, startOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, project: slug }),
      });
      const data = await res.json();
      setState(data.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  const spring = { type: "spring" as const, bounce: 0.1, duration: 0.5 };

  return (
    <div className="relative">
      <AnimatePresence mode="popLayout" initial={false}>
        {state === "idle" && (
          <motion.button
            key="cta"
            layoutId={`notify-${slug}`}
            type="button"
            onClick={() => setState("open")}
            className={`${variant === "dark" ? "btn-dark" : "btn-secondary"} !h-10 w-full sm:w-auto`}
            transition={spring}
          >
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {label}
            </motion.span>
          </motion.button>
        )}

        {(state === "open" || state === "loading" || state === "error") && (
          <motion.form
            key="form"
            layoutId={`notify-${slug}`}
            onSubmit={handleSubmit}
            className="flex items-center gap-1 rounded-full border border-warm-300 bg-white p-1 pl-4 focus-within:border-gold-500 focus-within:shadow-[0_0_0_4px_rgba(200,150,62,0.14)]"
            transition={spring}
          >
            <label htmlFor={`notify-email-${slug}`} className="sr-only">Email address</label>
            <motion.input
              ref={inputRef}
              id={`notify-email-${slug}`}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="min-w-0 flex-1 bg-transparent text-[13.5px] text-navy-950 placeholder:text-warm-400 focus:outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            />
            <button type="submit" disabled={state === "loading"} className="btn-dark !h-8 !px-4 text-[12.5px]">
              {state === "loading" ? (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-label="Sending">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Notify me"
              )}
            </button>
          </motion.form>
        )}

        {state === "done" && (
          <motion.div
            key="done"
            layoutId={`notify-${slug}`}
            className="flex h-10 items-center gap-2 rounded-full bg-[#3D8B6E]/10 px-4 text-[13px] font-medium text-[#3D8B6E]"
            transition={spring}
            role="status"
          >
            <motion.svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <motion.path
                d="M4.5 12.75l6 6 9-13.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.svg>
            You&apos;re on the list. We&apos;ll email you when it&apos;s ready.
          </motion.div>
        )}
      </AnimatePresence>
      {state === "error" && (
        <p className="mt-2 pl-4 text-[12px] text-[#B85C5C]" role="alert">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
