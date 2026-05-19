import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/projects";
import StatusPill from "./StatusPill";
import ProjectNotifyForm from "./ProjectNotifyForm";

export default function InDevCard({ project }: { project: Project }) {
  const { slug, name, tagline, liveUrl, screenshot, expectedShip } = project;

  return (
    <article className="card overflow-hidden group">
      {/* Screenshot or placeholder */}
      <div className="relative h-44 w-full bg-warm-200 overflow-hidden">
        {screenshot ? (
          <Image
            src={screenshot}
            alt={`${name} screenshot`}
            fill
            className="object-cover object-top"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-warm-300">
                <svg
                  className="h-5 w-5 text-warm-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 19.5h18M3.75 4.5h16.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75z"
                  />
                </svg>
              </div>
              <p className="text-[11px] font-medium text-warm-400 uppercase tracking-wider">
                Screenshot coming soon
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-[16px] font-semibold text-navy-950">{name}</h3>
            <p className="mt-0.5 text-[13px] text-warm-500">{tagline}</p>
          </div>
          <StatusPill status="in-development" />
        </div>

        {expectedShip && (
          <p className="text-[11px] font-medium uppercase tracking-wider text-warm-400 mb-4">
            Expected {expectedShip}
          </p>
        )}

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
