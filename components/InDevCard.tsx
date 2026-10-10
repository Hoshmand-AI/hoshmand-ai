"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import StatusPill from "./StatusPill";
import ProjectNotifyForm from "./ProjectNotifyForm";
import Wordmark from "./Wordmark";
import Spotlight from "./ui/Spotlight";

export default function InDevCard({ project }: { project: Project }) {
  const { slug, name, tagline, liveUrl, highlights } = project;
  const [expanded, setExpanded] = useState(false);

  return (
    <Spotlight as="article" className="card card-interactive group flex h-full flex-col overflow-hidden">
      {/* Wordmark banner */}
      <div className="hero-surface relative flex h-40 items-center justify-center">
        <Wordmark
          slug={slug}
          name={name}
          className="text-[40px] text-white transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-[18px] font-semibold text-navy-950">{name}</h3>
          <StatusPill status="in-development" />
        </div>
        <p className="text-[14px] leading-relaxed text-warm-600">{tagline}</p>

        {/* Collapsible highlights */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={`highlights-${slug}`}
          className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full py-1 text-[13px] font-semibold text-navy-950 transition-colors hover:text-gold-600"
        >
          {expanded ? "Show less" : "What it does"}
          <motion.svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </motion.svg>
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.ul
              id={`highlights-${slug}`}
              key="list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ height: { type: "spring", bounce: 0, duration: 0.45 }, opacity: { duration: 0.2 } }}
              className="overflow-hidden"
            >
              {highlights.map((h, i) => (
                <motion.li
                  key={h}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.4, delay: 0.04 * i }}
                  className="flex items-start gap-3 pt-3 text-[13.5px] text-warm-600 first:pt-4"
                >
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  {h}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <div className="mt-auto space-y-4 pt-6">
          <div className="h-px bg-warm-200" />
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="arrow-link text-[13px] text-gold-600 hover:text-gold-500">
              View live demo
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          )}
          <ProjectNotifyForm slug={slug} />
          <Link href={`/products/${slug}`} className="arrow-link text-[13px] text-warm-500 hover:text-navy-950">
            Full details
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </Spotlight>
  );
}
