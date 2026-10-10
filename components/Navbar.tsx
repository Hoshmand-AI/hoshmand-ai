"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Container from "./Container";
import { site, navigation } from "@/lib/site";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [isOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50">
      {/* Frosted bar: content scrolls underneath it. */}
      <div
        className={`glass-dark transition-[box-shadow,background-color] duration-500 ${
          scrolled ? "shadow-[0_1px_0_rgba(255,255,255,0.06),0_8px_32px_-12px_rgba(0,0,0,0.5)]" : ""
        }`}
      >
        <Container>
          <div
            className={`flex items-center justify-between transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              scrolled ? "h-14" : "h-16"
            }`}
          >
            <Link href="/" className="group flex items-center gap-2.5" aria-label={`${site.name} home`}>
              <Image
                src="/hoshmand-icon.png"
                alt=""
                width={28}
                height={28}
                className="rounded-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[-6deg] group-active:scale-90"
              />
              <span className="font-serif text-xl tracking-tight text-white">{site.name}</span>
            </Link>

            {/* Desktop nav: a hover pill and an active underline that glide between links. */}
            <nav className="hidden items-center md:flex" onMouseLeave={() => setHovered(null)} aria-label="Main">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    aria-current={active ? "page" : undefined}
                    className={`relative px-4 py-2 text-[13.5px] font-medium transition-colors duration-200 ${
                      active ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {hovered === item.href && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute inset-0 rounded-full bg-white/[0.08]"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                      />
                    )}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-4 -bottom-[3px] h-[2px] rounded-full bg-gold-500"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex">
              <Link href="/products" className="btn-primary !h-9 !px-4 text-[13px]">
                View Products
              </Link>
            </div>

            {/* Mobile toggle: two bars that cross into an X. */}
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 active:scale-90 md:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <motion.span
                className="absolute h-[1.5px] w-5 rounded-full bg-current"
                animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              />
              <motion.span
                className="absolute h-[1.5px] w-5 rounded-full bg-current"
                animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              />
            </button>
          </div>
        </Container>
      </div>

      {/* Mobile sheet: drops from the bar it belongs to and returns the same way. */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 top-0 -z-10 bg-navy-950/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="sheet"
              id="mobile-menu"
              className="glass-dark absolute inset-x-0 top-full origin-top border-t border-white/[0.06] shadow-2xl md:hidden"
              initial={{ opacity: 0, y: -12, scaleY: 0.96 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -12, scaleY: 0.96 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <Container className="py-5">
                <motion.nav
                  className="flex flex-col"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
                  aria-label="Mobile"
                >
                  {navigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <motion.div
                        key={item.href}
                        variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                      >
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-[17px] font-medium transition-colors active:bg-white/10 ${
                            active ? "bg-white/[0.08] text-white" : "text-white/70 hover:text-white"
                          }`}
                        >
                          {item.label}
                          {active && <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                  <motion.div
                    className="mt-4 border-t border-white/10 pt-4"
                    variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}
                  >
                    <Link href="/products" className="btn-primary w-full">View Products</Link>
                  </motion.div>
                </motion.nav>
              </Container>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
