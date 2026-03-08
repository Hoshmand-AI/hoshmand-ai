import Link from "next/link";

interface ProductCardProps {
  title: string;
  tagline: string;
  status: string;
  href: string;
  bullets: string[];
  appStoreUrl?: string;
}

export default function ProductCard({ title, tagline, status, href, bullets, appStoreUrl }: ProductCardProps) {
  const isLive = status === "Available on iOS";

  return (
    <article className="card p-6 group">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-[17px] font-semibold text-navy-950">{title}</h3>
          <p className="mt-1 text-[13.5px] text-warm-500">{tagline}</p>
        </div>
        <span
          className={`shrink-0 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
            isLive
              ? "border-[#3D8B6E]/20 bg-[#3D8B6E]/8 text-[#3D8B6E]"
              : "border-warm-200 bg-warm-100 text-warm-400"
          }`}
          style={isLive ? { backgroundColor: "rgba(61,139,110,0.08)" } : {}}
        >
          {status}
        </span>
      </div>

      <ul className="space-y-2.5 mb-6">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-[13.5px] text-warm-600">
            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
            {bullet}
          </li>
        ))}
      </ul>

      <div className="pt-4 border-t border-warm-200 flex items-center justify-between gap-4">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-warm-500 hover:text-navy-950 transition-colors duration-150"
        >
          Learn more
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        {appStoreUrl && (
          <a
            href={appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download on the App Store"
          >
            <AppStoreBadge />
          </a>
        )}
      </div>
    </article>
  );
}

function AppStoreBadge() {
  return (
    <svg
      width="108"
      height="32"
      viewBox="0 0 108 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="108" height="32" rx="6" fill="#0F2140"/>
      {/* Apple logo */}
      <path
        d="M14.5 8.5c.8-1 1.4-2.3 1.2-3.5-1.1.1-2.5.8-3.3 1.8-.7.9-1.3 2.2-1.1 3.4 1.2.1 2.4-.6 3.2-1.7zm1.2 1.8c-1.8-.1-3.3 1-4.1 1-.9 0-2.2-1-3.6-.9-1.9.0-3.6 1.1-4.5 2.8-1.9 3.3-.5 8.2 1.4 10.9.9 1.3 2 2.8 3.4 2.7 1.4-.1 1.9-.9 3.5-.9s2.1.9 3.5.8c1.5-.0 2.4-1.3 3.3-2.6.7-1 1.2-2.1 1.5-3.2-3.8-1.5-3.8-6.6.1-8.1-.8-1.4-2.2-2.4-3.5-2.5z"
        fill="white"
      />
      {/* "Download on the" text */}
      <text x="26" y="12" fontFamily="DM Sans, sans-serif" fontSize="7" fill="white" opacity="0.8">Download on the</text>
      {/* "App Store" text */}
      <text x="26" y="23" fontFamily="DM Sans, sans-serif" fontSize="12" fontWeight="600" fill="white">App Store</text>
    </svg>
  );
}
