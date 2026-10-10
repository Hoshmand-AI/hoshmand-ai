"use client";

import { motion } from "framer-motion";
import { useId, useEffect, useRef } from "react";

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  tone?: "light" | "dark";
  className?: string;
  ariaLabel: string;
}

// iOS-style segmented control: the selection pill springs between options.
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  tone = "light",
  className = "",
  ariaLabel,
}: SegmentedControlProps<T>) {
  const id = useId();
  const dark = tone === "dark";
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the selected segment visible when the control scrolls on narrow screens.
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!list || !el || list.scrollWidth <= list.clientWidth) return;
    const left = el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2;
    list.scrollTo({ left, behavior: "smooth" });
  }, [value]);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + options.length) % options.length;
    onChange(options[next].value);
    const el = document.getElementById(`${id}-${options[next].value}`);
    el?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className={`relative inline-flex max-w-full overflow-x-auto rounded-full p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        dark ? "bg-white/[0.07] ring-1 ring-white/10" : "bg-warm-200/70 ring-1 ring-warm-300/60"
      } ${className}`}
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            id={`${id}-${opt.value}`}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`relative z-10 shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[12.5px] sm:px-4 sm:text-[13px] font-semibold transition-colors duration-200 active:scale-[0.97] ${
              selected
                ? dark ? "text-navy-950" : "text-navy-950"
                : dark ? "text-white/60 hover:text-white" : "text-warm-500 hover:text-navy-950"
            }`}
          >
            {selected && (
              <motion.span
                layoutId={`${id}-pill`}
                className={`absolute inset-0 -z-10 rounded-full ${dark ? "bg-gold-500" : "bg-white shadow-[0_1px_3px_rgba(10,22,40,0.12),0_1px_1px_rgba(10,22,40,0.06)]"}`}
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
