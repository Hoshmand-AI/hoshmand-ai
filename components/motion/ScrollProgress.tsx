"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Hairline gold bar under the navbar that fills as you read the page.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gold-500"
      style={{ scaleX }}
    />
  );
}
