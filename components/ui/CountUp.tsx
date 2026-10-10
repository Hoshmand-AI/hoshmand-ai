"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

// Counts up to a number when it scrolls into view. Non-numeric values render as-is.
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const reduce = useReducedMotion();
  const target = /^\d+$/.test(value) ? Number(value) : null;

  useEffect(() => {
    if (!inView || target === null || reduce || !ref.current) return;
    const el = ref.current;
    const from = target > 100 ? target - 40 : 0;
    const controls = animate(from, target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => { el.textContent = String(Math.round(v)); },
    });
    return () => controls.stop();
  }, [inView, target, reduce]);

  return <span ref={ref} className={className}>{value}</span>;
}
