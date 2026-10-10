import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import StatusPill from "@/components/StatusPill";
import ProjectNotifyForm from "@/components/ProjectNotifyForm";
import ProjectTabs from "@/components/ProjectTabs";
import Wordmark from "@/components/Wordmark";
import AccessNote from "@/components/AccessNote";
import HeroText, { HeroFade } from "@/components/motion/HeroText";
import Reveal from "@/components/motion/Reveal";
import { getProject, projects } from "@/lib/projects";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return projects.filter((p) => !p.customPage).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject(params.slug);
  if (!project) return {};
  return { title: project.name, description: project.tagline };
}

const chevronLeft = (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

export default function ProjectDetailPage({ params }: Props) {
  const project = getProject(params.slug);

  if (!project) notFound();
  if (project.customPage) redirect(`/${project.slug}`);

  const { slug, name, tagline, status, liveUrl, expectedShip, problem, approach, highlights, ethics, artifact, appUrl, access } = project;
  const appHost = appUrl ? appUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";

  // Neighbours for the "next product" footer.
  const list = projects.filter((p) => !p.customPage);
  const idx = list.findIndex((p) => p.slug === slug);
  const next = list[(idx + 1) % list.length];

  return (
    <>
      {/* Hero */}
      <section className="hero-surface -mt-16 pb-20 pt-32 sm:pb-24 sm:pt-40">
        <Container>
          <HeroFade delay={0}>
            <Link
              href="/products"
              className="mb-10 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              {chevronLeft}
              All products
            </Link>
          </HeroFade>

          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <HeroFade delay={0.05}>
                <div className="mb-5"><StatusPill status={status} tone="dark" /></div>
              </HeroFade>
              <HeroText text={name} className="text-[3rem] !text-white sm:text-[4.2rem] !leading-none tracking-[-0.03em]" delay={0.1} />
              <HeroFade delay={0.35}>
                <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">{tagline}</p>
              </HeroFade>
              {appUrl && (
                <HeroFade delay={0.45}>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <a href={appUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !h-12 !px-7 text-[15px]">
                      Open {name}
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </a>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-medium text-white/70">{appHost}</span>
                      {access === "invite-only" && <AccessNote tone="dark" />}
                    </span>
                  </div>
                </HeroFade>
              )}
              {status === "in-development" && (
                <HeroFade delay={0.5}>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 bg-gold-500/[0.08] px-3.5 py-1.5 text-[12px] font-medium text-white/65">
                      <svg className="h-3.5 w-3.5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      Experimental — not for real-world use
                    </span>
                    {expectedShip && (
                      <span className="text-[11px] font-medium uppercase tracking-wider text-white/35">Expected {expectedShip}</span>
                    )}
                    {liveUrl && (
                      <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="arrow-link text-[13px] text-gold-500 hover:text-gold-400">
                        Try the live demo
                      </a>
                    )}
                  </div>
                </HeroFade>
              )}
            </div>

            {/* Wordmark tile: frosted glass floating on the hero. */}
            <HeroFade delay={0.3}>
              {(() => {
                const tile = (
                  <>
                    <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(200,150,62,0.18),transparent_70%)]" />
                    <Wordmark slug={slug} name={name} className="relative text-[52px] text-white sm:text-[64px]" />
                  </>
                );
                const cls = "relative mx-auto flex aspect-[4/3] w-full max-w-md items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl";
                return appUrl ? (
                  <a
                    href={appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${name} (${appHost}) in a new tab`}
                    className={`${cls} transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-gold-500/40`}
                  >
                    {tile}
                  </a>
                ) : (
                  <div className={cls}>{tile}</div>
                );
              })()}
            </HeroFade>
          </div>
        </Container>
      </section>

      {/* Main */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            <Reveal className="lg:col-span-2">
              <ProjectTabs problem={problem} approach={approach} highlights={highlights} ethics={ethics} />

              {artifact && (
                <a
                  href={artifact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card card-interactive group mt-10 flex items-center gap-4 p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-900 text-gold-500">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </span>
                  <span className="arrow-link text-[14.5px] text-navy-950 group-hover:text-gold-600">
                    {artifact.label}
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </a>
              )}
            </Reveal>

            <Reveal delay={0.1}>
              <div className="card p-6 lg:sticky lg:top-24">
                <p className="text-[16px] font-semibold text-navy-950">
                  {access === "invite-only" ? "No invite yet?" : "Get notified when it ships"}
                </p>
                <p className="mb-5 mt-1 text-[13px] text-warm-500">
                  {access === "invite-only"
                    ? `${name} is in an invite-only beta. Join the waitlist and we'll email you when a spot opens.`
                    : "No spam. One email when it's ready."}
                </p>
                <ProjectNotifyForm slug={slug} startOpen />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Next product */}
      {next && next.slug !== slug && (
        <section className="border-t border-warm-200">
          <Link href={`/products/${next.slug}`} className="group block bg-warm-100 transition-colors duration-500 hover:bg-navy-900">
            <Container className="flex items-center justify-between gap-6 py-12">
              <div>
                <p className="eyebrow mb-2 transition-colors duration-500 group-hover:!text-white/40">Next product</p>
                <Wordmark slug={next.slug} name={next.name} tone="light" className="text-[34px] text-navy-950 transition-colors duration-500 group-hover:text-white sm:text-[44px]" />
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-warm-300 text-navy-950 transition-all duration-500 group-hover:translate-x-1 group-hover:border-gold-500 group-hover:bg-gold-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Container>
          </Link>
        </section>
      )}
    </>
  );
}
