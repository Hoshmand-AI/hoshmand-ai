import type { Project } from "@/lib/projects";

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const formatDate = (d: string) => fmt.format(new Date(`${d}T00:00:00Z`));

// The product's own recent changes, newest first, as its card lists them.
export default function WhatsNew({ project }: { project: Project }) {
  const { updates, release, name } = project;
  if (!updates?.length) return null;
  return (
    <div className="card mt-10 p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[1.6rem]">What&apos;s new in {name}</h2>
        {release?.note && (
          <span className="text-[12px] text-warm-600">
            Latest release: <span className="font-medium text-navy-950">{release.note}</span>
          </span>
        )}
      </div>
      <ol className="mt-6 space-y-4 border-l border-warm-200 pl-5">
        {updates.map((u) => (
          <li key={`${u.date}-${u.title}`} className="relative">
            <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-gold-500" aria-hidden="true" />
            <p className="text-[12px] font-medium uppercase tracking-wider text-warm-600">{formatDate(u.date)}</p>
            <p className="mt-0.5 text-[14.5px] text-navy-950">{u.title}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
