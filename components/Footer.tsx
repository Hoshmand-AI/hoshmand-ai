import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import { site, navigation } from "@/lib/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900">
      <Container>
        <div className="py-12">
          {/* Top */}
          <div className="grid gap-10 sm:grid-cols-3">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <Image
                  src="/hoshmand-icon.png"
                  alt="Hoshmand AI"
                  width={24}
                  height={24}
                  className="rounded-md"
                />
                <span className="font-serif text-lg text-white">{site.name}</span>
              </div>
              <p className="text-[13px] leading-relaxed text-white/40">
                Responsible AI studio building practical, ethics-grounded products that help people follow through.
              </p>
            </div>

            {/* Product links */}
            <div>
              <p className="caption text-white/30 mb-4">Product</p>
              <nav className="flex flex-col gap-2.5">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-[13px] text-white/50 hover:text-white transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/mindcue" className="text-[13px] text-white/50 hover:text-white transition-colors duration-150">
                  MindCue AI
                </Link>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <p className="caption text-white/30 mb-4">Legal</p>
              <nav className="flex flex-col gap-2.5">
                <Link href="/privacy" className="text-[13px] text-white/50 hover:text-white transition-colors duration-150">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-[13px] text-white/50 hover:text-white transition-colors duration-150">
                  Terms of Service
                </Link>
                <a
                  href={`mailto:${site.supportEmail}`}
                  className="text-[13px] text-white/50 hover:text-white transition-colors duration-150"
                >
                  {site.supportEmail}
                </a>
              </nav>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-white/[0.08]" />

          {/* Bottom */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-white/25">
              © {currentYear} {site.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <a
                href={site.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-white/35 hover:text-white transition-colors duration-150"
              >
                LinkedIn
              </a>
              <span className="text-[12px] text-white/20">Built in Virginia</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
