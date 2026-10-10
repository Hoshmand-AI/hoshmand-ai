"use client";

import { useState, useId, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AccordionItem {
  title: string;
  content: ReactNode;
  meta?: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number | null;
  allowMultiple?: boolean;
  className?: string;
  variant?: "plain" | "card";
  /** When set, opens (true) or closes (false) every item; the user can still toggle afterwards. */
  expandAll?: boolean;
}

export default function Accordion({ items, defaultOpen = null, allowMultiple = false, className = "", variant = "plain", expandAll }: AccordionProps) {
  const [open, setOpen] = useState<number[]>(defaultOpen === null ? [] : [defaultOpen]);
  const baseId = useId();

  useEffect(() => {
    if (expandAll === undefined) return;
    setOpen(expandAll ? Array.from({ length: items.length }, (_, i) => i) : []);
  }, [expandAll, items.length]);

  function toggle(i: number) {
    setOpen((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : allowMultiple ? [...prev, i] : [i]
    );
  }

  return (
    <div className={`${variant === "card" ? "space-y-3" : "divide-y divide-warm-200 border-y border-warm-200"} ${className}`}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div
            key={item.title}
            className={
              variant === "card"
                ? `card overflow-hidden ${isOpen ? "border-warm-300 shadow-[var(--shadow-md)]" : ""}`
                : ""
            }
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className={`group flex w-full items-center justify-between gap-4 text-left transition-colors duration-200 ${
                  variant === "card" ? "px-5 py-4 sm:px-6" : "py-5"
                }`}
              >
                <span className="flex items-center gap-3">
                  {item.meta}
                  <span className={`text-[15px] font-semibold tracking-tight transition-colors duration-200 ${isOpen ? "text-navy-950" : "text-warm-700 group-hover:text-navy-950"}`}>
                    {item.title}
                  </span>
                </span>
                <span
                  className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                    isOpen ? "border-navy-900 bg-navy-900 text-white" : "border-warm-300 text-warm-500 group-hover:border-warm-400"
                  }`}
                  aria-hidden="true"
                >
                  {/* Plus that morphs into a minus. */}
                  <span className="absolute h-[1.5px] w-3 rounded-full bg-current" />
                  <motion.span
                    className="absolute h-3 w-[1.5px] rounded-full bg-current"
                    animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { type: "spring", bounce: 0, duration: 0.45 }, opacity: { duration: 0.25 } }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ y: -6 }}
                    animate={{ y: 0 }}
                    exit={{ y: -6 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.45 }}
                    className={`text-[14.5px] leading-relaxed text-warm-600 ${variant === "card" ? "px-5 pb-5 sm:px-6" : "pb-5 pr-11"}`}
                  >
                    {item.content}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
