"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Container from "./Container";
import { site, navigation } from "@/lib/site";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-navy-900 transition-shadow duration-200 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <Container>
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/hoshmand-icon.png"
              alt="Hoshmand AI"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="font-serif text-xl text-white tracking-tight">
              {site.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-4 text-[13.5px] font-medium transition-colors duration-150 border-b-2 ${
                    isActive
                      ? "text-white border-gold-500"
                      : "text-white/55 border-transparent hover:text-white/85"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right */}
          <div className="hidden items-center gap-5 md:flex">
            <Link
              href="/contact"
              className="text-[13.5px] font-medium text-white/60 hover:text-white transition-colors duration-150"
            >
              Contact
            </Link>
            <Link href="/products" className="btn-primary text-[13px]" style={{ height: "34px" }}>
              View Products
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <div className="relative h-4 w-5">
              <span className={`absolute left-0 top-0 block h-0.5 w-5 bg-current transition-all duration-200 ${isOpen ? "top-2 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-2 block h-0.5 w-5 bg-current transition-all duration-200 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-4 block h-0.5 w-5 bg-current transition-all duration-200 ${isOpen ? "top-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-navy-900 transition-opacity duration-200 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <Container className="pt-20">
          <nav className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-4 py-3.5 text-lg font-medium transition-colors ${
                    isActive ? "text-white bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 border-t border-white/10 pt-6">
            <Link href="/products" className="btn-primary w-full justify-center">
              View Products
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
}
