import Link from "next/link";
import Image from "next/image";
import Spotlight from "./ui/Spotlight";

interface ProductCardProps {
  title: string;
  tagline: string;
  status: string;
  href: string;
  bullets: string[];
  appStoreUrl?: string;
}

export default function ProductCard({ title, tagline, status, href, bullets, appStoreUrl }: ProductCardProps) {
  return (
    <Spotlight as="article" className="card card-interactive group overflow-hidden">
      <div className="relative z-10 grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="mb-5 flex items-center gap-4">
            <Image
              src="/mindcue-logo.png"
              alt=""
              width={56}
              height={56}
              className="rounded-[14px] shadow-[var(--shadow-md)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-3 group-hover:scale-105"
            />
            <div>
              <h3 className="text-[20px] font-semibold text-navy-950">{title}</h3>
              <span className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#3D8B6E]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3D8B6E]" />
                {status}
              </span>
            </div>
          </div>
          <p className="mb-5 text-[15px] text-warm-600">{tagline}</p>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-[13.5px] text-warm-600">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-row items-center gap-4 md:flex-col md:items-stretch">
          {appStoreUrl && (
            <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="btn-dark gap-2.5 !px-5" aria-label="Download MindCue AI on the App Store">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.37 12.6c-.02-2.27 1.86-3.37 1.94-3.42-1.06-1.55-2.7-1.76-3.28-1.78-1.4-.14-2.73.82-3.44.82-.71 0-1.8-.8-2.96-.78-1.52.02-2.93.89-3.71 2.25-1.59 2.75-.41 6.81 1.13 9.04.76 1.09 1.66 2.31 2.83 2.27 1.14-.05 1.57-.73 2.94-.73s1.76.73 2.96.71c1.22-.02 2-1.11 2.74-2.21.87-1.26 1.22-2.49 1.24-2.55-.03-.01-2.37-.91-2.39-3.62zM14.13 5.94c.62-.76 1.05-1.8.93-2.85-.9.04-2 .6-2.64 1.35-.57.66-1.08 1.73-.95 2.75 1.01.08 2.03-.51 2.66-1.25z" />
              </svg>
              App Store
            </a>
          )}
          <Link href={href} className="arrow-link justify-center text-[13.5px] text-warm-600 hover:text-navy-950">
            Learn more
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </Spotlight>
  );
}
