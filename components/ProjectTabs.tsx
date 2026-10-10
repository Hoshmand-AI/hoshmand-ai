"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SegmentedControl from "./ui/SegmentedControl";

type Tab = "overview" | "highlights" | "ethics";

interface ProjectTabsProps {
  problem: string;
  approach: string;
  highlights: string[];
  ethics: string[];
}

const check = (color: string) => (
  <svg className="mt-0.5 h-[18px] w-[18px] shrink-0" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export default function ProjectTabs({ problem, approach, highlights, ethics }: ProjectTabsProps) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div>
      <SegmentedControl<Tab>
        ariaLabel="Product details"
        value={tab}
        onChange={setTab}
        options={[
          { value: "overview", label: "Overview" },
          { value: "highlights", label: "Highlights" },
          { value: "ethics", label: "Ethics" },
        ]}
      />

      <div className="mt-8" role="tabpanel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            {tab === "overview" && (
              <div className="space-y-8">
                <div>
                  <p className="eyebrow mb-3 !text-gold-600">The problem</p>
                  <p className="text-[17px] leading-relaxed text-warm-600">{problem}</p>
                </div>
                <div className="h-px bg-warm-200" />
                <div>
                  <p className="eyebrow mb-3 !text-gold-600">The approach</p>
                  <p className="text-[17px] leading-relaxed text-warm-600">{approach}</p>
                </div>
              </div>
            )}
            {tab === "highlights" && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {highlights.map((h, i) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.45, delay: i * 0.05 }}
                    className="card flex items-start gap-3 p-5 text-[14.5px] text-warm-700"
                  >
                    {check("#C8963E")}
                    {h}
                  </motion.li>
                ))}
              </ul>
            )}
            {tab === "ethics" && (
              <ul className="space-y-3">
                {ethics.map((e, i) => (
                  <motion.li
                    key={e}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.45, delay: i * 0.05 }}
                    className="flex items-start gap-3 rounded-2xl border border-[#3D8B6E]/15 bg-[#3D8B6E]/[0.04] p-5 text-[14.5px] text-warm-700"
                  >
                    {check("#3D8B6E")}
                    {e}
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
