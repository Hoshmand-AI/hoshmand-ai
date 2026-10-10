"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
}

// Card whose gold glow follows the pointer. Writes CSS variables directly, so no React re-renders.
export default function Spotlight({ children, className = "", as = "div" }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as;

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <Tag ref={ref} onPointerMove={onPointerMove} className={`spotlight ${className}`}>
      {children}
    </Tag>
  );
}
