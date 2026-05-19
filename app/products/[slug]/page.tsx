import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import StatusPill from "@/components/StatusPill";
import ProjectNotifyForm from "@/components/ProjectNotifyForm";
import { getProject, projects } from "@/lib/projects";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return projects
    .filter((p) => !p.customPage)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.tagline,
  };
}

export default function ProjectDetailPage({ params }: Props) {
  const project = getProject(params.slug);

  if (!project) notFound();
  if (project.customPage) redirect(`/${project.slug}`);

  const {
    name,
    tagline,
    status,
    liveUrl,
    screenshot,
    expectedShip,
    problem,
    approach,
    highlights,
    ethics,
    artifact,
  } = project;

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 py-16 sm:py-20">
        <Container>
          <div className="mb-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/40 hover:text-white/70 transition-colors duration-150"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              All products
            </Link>
          </div>

          <div className="flex flex-wrap items-start gap-4 mb-4">
            <h1
              className="text-4xl sm:text-5xl"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 400,
                color: "white",
              }}
            >
              {name}
            </h1>
            <div className="mt-2">
              <StatusPill status={status} />
            </div>
          </div>

          <p className="max-w-xl text-[16px] text-white/55 mb-8">{tagline}</p>

          {/* Experimental banner */}
          {status === "in-development" && (
            <div
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-[12px] font-medium mb-8"
              style={{
                borderColor: "rgba(200,150,62,0.25)",
                backgroundColor: "rgba(200,150,62,0.08)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <svg className="h-3.5 w-3.5 text-[#C8963E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Experimental — not for real-world use
              {liveUrl && (
                <>
                  <span className="mx-1 text-white/20">·</span>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#C8963E] hover:text-[#D4A94F] transition-colors"
                  >
                    Try the live demo →
                  </a>
                </>
              )}
            </div>
          )}

          {expectedShip && (
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/30">
              Expected {expectedShip}
            </p>
          )}
        </Container>
      </section>

      {/* Screenshot */}
      {screenshot ? (
        <div className="relative w-full h-64 sm:h-80 bg-warm-200 overflow-hidden">
          <Image
            src={screenshot}
            alt={`${name} screenshot`}
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-warm-200 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-warm-300">
              <svg className="h-6 w-6 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 19.5h18M3.75 4.5h16.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V5.25a.75.75 0 01.75-.75z" />
              </svg>
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-warm-400">Screenshot coming soon</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">

            {/* Left — Problem + Approach */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <p className="eyebrow mb-3">The Problem</p>
                <p className="text-[15px] leading-relaxed text-warm-600">{problem}</p>
              </div>
              <div>
                <p className="eyebrow mb-3">The Approach</p>
                <p className="text-[15px] leading-relaxed text-warm-600">{approach}</p>
              </div>

              {/* Ethics */}
              <div>
                <p className="eyebrow mb-4">Ethics & Disclosure</p>
                <ul className="space-y-3">
                  {ethics.map((e) => (
                    <li key={e} className="flex items-start gap-3 text-[14px] text-warm-600">
                      <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#3D8B6E]" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Artifact */}
              {artifact && (
                <div className="rounded-lg border border-warm-200 bg-warm-100 p-5">
                  <a
                    href={artifact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-navy-950 hover:text-[#C8963E] transition-colors duration-150"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    {artifact.label}
                  </a>
                </div>
              )}
            </div>

            {/* Right — Highlights + Notify */}
            <div className="space-y-6">
              <div className="card p-5">
                <p className="eyebrow mb-4">Highlights</p>
                <ul className="space-y-3">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-[13.5px] text-warm-600">
                      <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8963E]" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#C8963E] px-4 py-3 text-[13px] font-semibold text-navy-950 hover:bg-[#D4A94F] transition-colors duration-150"
                >
                  Try the live demo
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              )}

              <div className="card p-5">
                <p className="text-[13px] font-semibold text-navy-950 mb-1">Get notified when it ships</p>
                <p className="text-[12px] text-warm-400 mb-4">No spam. One email when it's ready.</p>
                <ProjectNotifyForm slug={project.slug} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Back */}
      <section className="border-t border-warm-200 py-10">
        <Container>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-warm-500 hover:text-navy-950 transition-colors duration-150"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to all products
          </Link>
        </Container>
      </section>
    </>
  );
}
