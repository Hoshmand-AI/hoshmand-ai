"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useInView, useReducedMotion } from "framer-motion";

// One shape, never cut. It morphs through the products' real states (size, corner radius
// and colour change; the content swaps with a short blur) while a cursor drives each change.
// The last state leads back into the first, so it loops seamlessly.

type StateId = "cta" | "inbox" | "schedule" | "notes";

interface StageState {
  id: StateId;
  w: number;
  h: number;
  r: number;
  bg: string;
  border: string;
  /** Where the cursor clicks, relative to the shape's centre. */
  click: { x: number; y: number };
  hold: number;
}

const STATES: StageState[] = [
  { id: "cta", w: 236, h: 58, r: 29, bg: "#C8963E", border: "rgba(255,255,255,0.25)", click: { x: 62, y: 6 }, hold: 0.7 },
  { id: "inbox", w: 360, h: 280, r: 26, bg: "#162D54", border: "rgba(255,255,255,0.10)", click: { x: 110, y: 96 }, hold: 1.6 },
  { id: "schedule", w: 380, h: 270, r: 20, bg: "#F8F6F3", border: "rgba(10,22,40,0.06)", click: { x: 120, y: 88 }, hold: 1.6 },
  { id: "notes", w: 340, h: 318, r: 30, bg: "#0F2140", border: "rgba(255,255,255,0.10)", click: { x: 120, y: 70 }, hold: 1.6 },
];

const shapeSpring = { type: "spring" as const, bounce: 0.12, duration: 0.75 };
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function MorphStage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(1);
  const [pressed, setPressed] = useState(0);
  const cursor = useAnimationControls();
  const state = STATES[index];
  const animated = inView && !reduce;

  useEffect(() => {
    if (!animated) return;
    let cancelled = false;
    (async () => {
      // Let the shape settle, read for a beat, then travel to the target and click.
      await wait(state.hold * 1000);
      if (cancelled) return;
      await cursor.start({ x: state.click.x, y: state.click.y, transition: { type: "spring", bounce: 0, duration: 0.85 } });
      if (cancelled) return;
      await cursor.start({ scale: 0.82, transition: { duration: 0.09 } });
      setPressed((p) => p + 1);
      await cursor.start({ scale: 1, transition: { duration: 0.16 } });
      if (cancelled) return;
      await wait(120);
      if (!cancelled) setIndex((i) => (i + 1) % STATES.length);
    })();
    return () => {
      cancelled = true;
      cursor.stop();
    };
  }, [index, animated, state, cursor]);

  return (
    <div ref={ref} className="relative mx-auto flex h-[340px] w-full max-w-[440px] items-center justify-center sm:h-[400px]" aria-hidden="true">
      <div className="origin-center scale-[0.82] sm:scale-100">
        <motion.div
          className="relative overflow-hidden"
          initial={false}
          animate={{
            width: state.w,
            height: state.h,
            borderRadius: state.r,
            backgroundColor: state.bg,
            boxShadow:
              state.id === "cta"
                ? "0 14px 32px -12px rgba(200,150,62,0.55)"
                : "0 40px 80px -24px rgba(0,0,0,0.55)",
          }}
          transition={shapeSpring}
          style={{ border: `1px solid ${state.border}` }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={state.id}
              className="absolute inset-0"
              initial={{ opacity: 0, filter: "blur(8px)", scale: 0.98 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(8px)", scale: 1.02 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {state.id === "cta" && <CtaContent />}
              {state.id === "inbox" && <InboxContent />}
              {state.id === "schedule" && <ScheduleContent />}
              {state.id === "notes" && <NotesContent />}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Cursor, positioned from the shape's centre. */}
        {animated && (
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10"
            initial={{ x: 150, y: 170, scale: 1 }}
            animate={cursor}
          >
            <AnimatePresence>
              <motion.span
                key={pressed}
                className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-white/70"
                initial={{ scale: 0.4, opacity: pressed ? 0.9 : 0 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
            <svg width="22" height="24" viewBox="0 0 22 24" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
              <path d="M2 1.5 L2 19 L6.6 14.8 L9.6 21.6 L12.6 20.3 L9.7 13.6 L15.8 13.6 Z" fill="#FFFFFF" stroke="#0A1628" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const item = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, bounce: 0, duration: 0.5, delay: 0.15 + i * 0.06 },
});

function CtaContent() {
  return (
    <div className="flex h-full items-center justify-center gap-2 text-[15px] font-semibold text-navy-950">
      Open MailHandled
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
      </svg>
    </div>
  );
}

function InboxContent() {
  const accounts = [
    { name: "Work", dot: "#4A7FB5" },
    { name: "Studio", dot: "#C8963E" },
    { name: "Personal", dot: "#3D8B6E" },
    { name: "Side project", dot: "#9B8FD4" },
  ];
  return (
    <div className="flex h-full flex-col p-6 text-white">
      <div className="flex items-center justify-between">
        <span className="whitespace-nowrap text-[15px] leading-none">
          <span className="font-bold">Mail</span>
          <span className="font-serif text-gold-400">Handled</span>
        </span>
        <span className="text-[11px] text-white/45">Daily brief</span>
      </div>
      <motion.div {...item(0)} className="mt-5 flex items-baseline gap-2">
        <span className="font-serif text-[44px] leading-none text-gold-400">6</span>
        <span className="text-[13px] text-white/60">need you today</span>
      </motion.div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {accounts.map((a, i) => (
          <motion.div key={a.name} {...item(i + 1)} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[12px] text-white/75">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: a.dot }} />
            {a.name}
          </motion.div>
        ))}
      </div>
      <motion.div {...item(5)} className="mt-auto flex gap-2">
        {[
          { t: "Urgent", c: "#B85C5C" },
          { t: "Reply", c: "#4A7FB5" },
          { t: "FYI", c: "#3D8B6E" },
        ].map((chip) => (
          <span key={chip.t} className="rounded-md px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: `${chip.c}26`, color: "#FFFFFF" }}>
            {chip.t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ScheduleContent() {
  const rows = [
    { label: "Site work", start: 0, len: 30, critical: false },
    { label: "Foundations", start: 22, len: 34, critical: true },
    { label: "Framing", start: 50, len: 30, critical: true },
    { label: "Inspection", start: 78, len: 18, critical: false },
  ];
  return (
    <div className="flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <span className="whitespace-nowrap text-[15px] leading-none text-navy-950">
          <span className="font-bold">Plan</span>
          <span className="font-serif text-gold-500">ora</span>
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-warm-500">
          <span className="h-1.5 w-3 rounded-full bg-gold-500" /> Critical path
        </span>
      </div>
      <div className="mt-6 space-y-3.5">
        {rows.map((row, i) => (
          <div key={row.label} className="grid grid-cols-[84px_1fr] items-center gap-3">
            <span className="text-[12px] text-warm-600">{row.label}</span>
            <div className="relative h-3 rounded-full bg-warm-200">
              <motion.div
                className="absolute inset-y-0 rounded-full"
                style={{ left: `${row.start}%`, backgroundColor: row.critical ? "#C8963E" : "#1E3A6A" }}
                initial={{ width: 0 }}
                animate={{ width: `${row.len}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.7, delay: 0.2 + i * 0.08 }}
              />
            </div>
          </div>
        ))}
      </div>
      <motion.div {...item(5)} className="mt-auto flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 text-[12px] shadow-[var(--shadow-sm)]">
        <span className="text-warm-600">What&apos;s on track, what&apos;s late</span>
        <span className="font-semibold text-navy-950">Explained</span>
      </motion.div>
    </div>
  );
}

function NotesContent() {
  const notes = [
    { src: "Gmail", text: "Reply needed on the contract draft" },
    { src: "LinkedIn", text: "New message from a recruiter" },
    { src: "WhatsApp", text: "Pickup moved to 5 pm" },
  ];
  return (
    <div className="flex h-full flex-col p-6 text-white">
      <div className="flex items-center justify-between">
        <span className="whitespace-nowrap text-[15px] leading-none">
          <span className="font-bold">Safe</span>
          <span className="font-serif text-gold-400">Claw</span>
        </span>
        <span className="text-[11px] text-white/45">What may need you</span>
      </div>
      <div className="mt-5 space-y-2.5">
        {notes.map((n, i) => (
          <motion.div key={n.src} {...item(i)} className="rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5">
            <div className="text-[10.5px] font-semibold uppercase tracking-wider text-gold-400/90">{n.src}</div>
            <div className="mt-0.5 text-[12.5px] text-white/85">{n.text}</div>
          </motion.div>
        ))}
      </div>
      <motion.div {...item(4)} className="mt-auto pt-3 text-center text-[11.5px] text-white/50">
        It never sends anything for you.
      </motion.div>
    </div>
  );
}
