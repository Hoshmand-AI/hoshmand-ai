import { site } from "@/lib/site";

export function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// "See it on Instagram" link to the studio's page, where product posts, reels and stories go up.
export default function InstagramLink({
  href = site.instagramUrl,
  label = `See it on Instagram ${site.instagramHandle}`,
  tone = "light",
}: { href?: string; label?: string; tone?: "light" | "dark" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors ${
        tone === "dark" ? "text-white/75 hover:text-white" : "text-navy-950 hover:text-gold-600"
      }`}
    >
      <InstagramIcon />
      {label}
    </a>
  );
}
