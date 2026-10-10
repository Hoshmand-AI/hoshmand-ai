"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Critically damped springs by default; honors the OS "reduce motion" setting site-wide.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", bounce: 0, duration: 0.5 }}>
      {children}
    </MotionConfig>
  );
}
