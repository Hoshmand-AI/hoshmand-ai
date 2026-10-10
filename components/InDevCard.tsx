import Link from "next/link";
import type { Project } from "@/lib/projects";
import StatusPill from "./StatusPill";
import ProjectNotifyForm from "./ProjectNotifyForm";

// Wordmark split per the brand system: bold first part + gold serif second part.
const WORDMARK_SPLIT: Record<string, [string, string]> = {
  care360: ["Care", "360"],
  mailhandled: ["Mail", "Handled"],
  safeclaw: ["Safe", "Claw"],
  planora: ["Plan", "ora"],
};

export default function InDevCard({ project }: { project: Project }) {
  const { slug, name, tagline, liveUrl } = project;
  const [first, second] = WORDMARK_SPLIT[slug] ?? [name, ""];

  return (
    <article className="card overflow-hidden">
      {/* Wordmark banner */}
      <div className="flex h-36 w-full items-center justify-center bg-navy-900">
        <p className="text-[36px] leading-none text-white" aria-hidden="true">
          <span className="font-bold">{first}</span>
          <span className="font-serif text-gold-400">{second}</span>
        </p>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[16px] font-semibold text-navy-950">{name}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-warm-500">{tagline}</p>
          </div>
          <StatusPill status="in-development" />
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-3 border-t border-warm-200">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#C8963E] hover:text-[#B8862E] transition-colors duration-150"
            >
              View live demo
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}

          <ProjectNotifyForm slug={slug} />

          <Link
            href={`/products/${slug}`}
            className="inline-flex items-center gap-1 text-[12px] text-warm-400 hover:text-navy-950 transition-colors duration-150"
          >
            Full details
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
