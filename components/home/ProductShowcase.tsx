"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import SegmentedControl from "../ui/SegmentedControl";
import Wordmark from "../Wordmark";
import StatusPill from "../StatusPill";

export interface ShowcaseProduct {
  slug: string;
  name: string;
  tagline: string;
  status: "shipping" | "in-development";
  highlights: string[];
  href: string;
  appStoreUrl?: string;
}

// Interactive product switcher: pick a product, the stage slides in the direction you moved.
export default function ProductShowcase({ products }: { products: ShowcaseProduct[] }) {
  const [active, setActive] = useState(products[0].slug);
  const [direction, setDirection] = useState(1);
  const index = products.findIndex((p) => p.slug === active);
  const product = products[index];

  function select(slug: string) {
    const next = products.findIndex((p) => p.slug === slug);
    setDirection(next > index ? 1 : -1);
    setActive(slug);
  }

  return (
    <div>
      <div className="flex justify-center">
        <SegmentedControl
          ariaLabel="Choose a product"
          options={products.map((p) => ({ value: p.slug, label: p.name }))}
          value={active}
          onChange={select}
        />
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[1.75rem] border border-warm-200 bg-white shadow-[var(--shadow-lg)]" role="tabpanel">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={product.slug}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 60 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -60 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", bounce: 0, duration: 0.55 }}
            className="grid md:grid-cols-2"
          >
            {/* Stage */}
            <div className="hero-surface flex min-h-[240px] flex-col items-center justify-center gap-5 p-10 md:min-h-[400px]">
              {product.slug === "mindcue" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.7, delay: 0.1 }}
                >
                  <Image src="/mindcue-logo.png" alt="" width={84} height={84} className="rounded-[20px] shadow-2xl" />
                </motion.div>
              )}
              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0, duration: 0.7, delay: 0.08 }}
              >
                <Wordmark slug={product.slug} name={product.name} className="text-[44px] text-white sm:text-[56px]" />
              </motion.div>
            </div>

            {/* Details */}
            <div className="flex flex-col p-8 sm:p-10">
              <div className="mb-4">
                <StatusPill status={product.status} />
              </div>
              <p className="text-[16px] leading-relaxed text-warm-600">{product.tagline}</p>
              <ul className="mt-6 space-y-3">
                {product.highlights.slice(0, 4).map((h, i) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.12 + i * 0.05 }}
                    className="flex items-start gap-3 text-[14px] text-warm-600"
                  >
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {h}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
                {product.appStoreUrl ? (
                  <a href={product.appStoreUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Get it on the App Store
                  </a>
                ) : (
                  <Link href={product.href} className="btn-primary">Join the waitlist</Link>
                )}
                <Link href={product.href} className="arrow-link text-[13.5px] text-warm-600 hover:text-navy-950">
                  Learn more
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
