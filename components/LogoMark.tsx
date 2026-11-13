"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface LogoMarkProps {
  size?: number;
  className?: string;
  /** Show the "thinking" state: rings spin faster and the core breathes. */
  active?: boolean;
  /** Follow the pointer anywhere on the page (default) or stay still. */
  track?: boolean;
}

// The Hoshmand AI mark, alive: two rings around a core. The core looks toward the
// pointer, the rings orbit slowly, and a press sends a pulse outward.
export default function LogoMark({ size = 28, className = "", active = false, track = true }: LogoMarkProps) {
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const id = useId();
  const [pulse, setPulse] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (reduce || !track) return;
    function onMove(e: PointerEvent) {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      // The core travels at most 9 units (of 100) from the centre, easing in with distance.
      const reach = 9 * Math.min(1, dist / 220);
      x.set((dx / dist) * reach);
      y.set((dy / dist) * reach);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, track, x, y]);

  const spin = (seconds: number, reverse = false) =>
    reduce
      ? undefined
      : { rotate: reverse ? -360 : 360, transition: { duration: active ? seconds / 4 : seconds, ease: "linear" as const, repeat: Infinity } };

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      onPointerDown={() => setPulse((p) => p + 1)}
    >
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor="#A99BE8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#A99BE8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="#0C0C10" />

      {/* Outer ring: a bright arc orbits it. */}
      <circle cx="50" cy="50" r="35" fill="none" stroke="#8B7FD4" strokeOpacity="0.35" strokeWidth="2.2" />
      <motion.circle
        cx="50" cy="50" r="35" fill="none" stroke="#A99BE8" strokeWidth="2.6" strokeLinecap="round"
        strokeDasharray="60 160" style={{ transformOrigin: "50px 50px" }} animate={spin(9)}
      />
      {/* Inner ring orbits the other way. */}
      <circle cx="50" cy="50" r="22" fill="none" stroke="#8B7FD4" strokeOpacity="0.2" strokeWidth="1.4" />
      <motion.circle
        cx="50" cy="50" r="22" fill="none" stroke="#8B7FD4" strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round"
        strokeDasharray="26 112" style={{ transformOrigin: "50px 50px" }} animate={spin(6, true)}
      />

      {/* Pulse on press. */}
      {pulse > 0 && !reduce && (
        <motion.circle
          key={pulse}
          cx="50" cy="50" r="8" fill="none" stroke="#A99BE8" strokeWidth="2"
          initial={{ scale: 1, opacity: 0.9 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "50px 50px" }}
        />
      )}

      {/* Core: follows the pointer, breathes while thinking. */}
      <motion.g style={{ x: sx, y: sy }}>
        <motion.circle
          cx="50" cy="50" r="15" fill={`url(#${id}-glow)`}
          animate={active && !reduce ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={active ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
          style={{ transformOrigin: "50px 50px" }}
        />
        <circle cx="50" cy="50" r="6" fill="#B7AAF0" />
      </motion.g>
    </svg>
  );
}
