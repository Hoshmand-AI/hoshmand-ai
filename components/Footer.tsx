import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import { site, navigation } from "@/lib/site";
import { projects } from "@/lib/projects";

const linkClass =
  "w-fit text-[13px] text-white/50 transition-colors duration-200 hover:text-white";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-navy-950">
      {/* Hairline of gold light along the top edge. */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      <Container>
        <div className="py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-3 flex items-center gap-2.5">
                <Image src="/hoshmand-icon.png" alt="" width={24} height={24} className="rounded-md" />
                <span className="font-serif text-lg text-white">{site.name}</span>
              </div>
              <p className="max-w-xs text-[13px] leading-relaxed text-white/40">
                Responsible AI studio building practical, ethics-grounded products that help people follow through.
              </p>
            </div>

            <div>
              <p className="caption mb-4 text-white/30">Company</p>
              <nav className="flex flex-col gap-2.5" aria-label="Footer">
                {navigation.map((item) => (
                  <Link key={item.href} href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="caption mb-4 text-white/30">Products</p>
              <nav className="flex flex-col gap-2.5" aria-label="Products">
                {projects.map((p) => (
                  <Link
                    key={p.slug}
                    href={p.customPage ? `/${p.slug}` : `/products/${p.slug}`}
                    className={linkClass}
                  >
                    {p.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <p className="caption mb-4 text-white/30">Legal</p>
              <nav className="flex flex-col gap-2.5" aria-label="Legal">
                <Link href="/privacy" className={linkClass}>Privacy Policy</Link>
                <Link href="/terms" className={linkClass}>Terms of Service</Link>
                <a href={`mailto:${site.supportEmail}`} className={linkClass}>{site.supportEmail}</a>
              </nav>
            </div>
          </div>

          <div className="my-10 h-px bg-white/[0.06]" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-white/30">
              © {currentYear} {site.name}. All rights reserved. Built by {site.name}.
            </p>
            <div className="flex items-center gap-5">
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-white/40 transition-colors duration-200 hover:text-white"
              >
                Instagram
              </a>
              <a
                href={site.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-white/40 transition-colors duration-200 hover:text-white"
              >
                LinkedIn
              </a>
              <span className="text-[12px] text-white/25">Built in Virginia</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
