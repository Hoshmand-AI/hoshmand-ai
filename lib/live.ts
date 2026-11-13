import { projects, type Project } from "./projects";

// Live product data. Each linked product publishes a public product card (docs/PRODUCT-CARD.md);
// this module reads it and lays it over the copy in lib/projects.ts, so a product's new name, logo,
// description or feature shows on hoshmand.ai about a minute after that product deploys.
//
// Server only. Every value from a card is treated as untrusted text: checked for type, trimmed to a
// length, and images and links are accepted only over https from the card's own origin. If a card
// is slow, down or malformed, the product keeps its last good data or the fallback copy, and the
// page still renders.

/** Seconds between reads of a product card (and between re-renders of pages that show one). */
export const CARD_REVALIDATE = 30;
const TIMEOUT_MS = 3500;
const SCHEMA = "hoshmand.product/1";

const str = (v: unknown, max: number): string | undefined => {
  if (typeof v !== "string") return undefined;
  const t = v.replace(/\s+/g, " ").trim();
  return t ? t.slice(0, max) : undefined;
};

const strList = (v: unknown, maxItems: number, maxLen: number): string[] | undefined => {
  if (!Array.isArray(v)) return undefined;
  const out = v.map((x) => str(x, maxLen)).filter((x): x is string => !!x).slice(0, maxItems);
  return out.length ? out : undefined;
};

/** An https URL on `origin` (relative paths resolve against it); anything else is dropped. */
function sameOriginUrl(v: unknown, origin: string): string | undefined {
  const s = str(v, 500);
  if (!s) return undefined;
  try {
    const u = new URL(s, origin);
    return u.protocol === "https:" && u.origin === origin ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

export interface ProductCard {
  name: string;
  formerNames?: string[];
  tagline?: string;
  summary?: string;
  url?: string;
  status?: "beta" | "live" | "in-development";
  access?: "invite-only" | "open";
  accessNote?: string;
  logo?: Project["logo"];
  highlights?: string[];
  updates?: { date: string; title: string }[];
  release?: { id: string; note?: string; builtAt?: string };
}

/** Validate a card read from `cardUrl`. Returns null when it is not a usable card. */
export function parseCard(raw: unknown, cardUrl: string): ProductCard | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.schema !== SCHEMA) return null;
  // A product name is letters (Latin, accented), digits, spaces and a little punctuation; anything else is not a name.
  const name = str(r.name, 40);
  if (!name || !/^[A-Za-z0-9\u00C0-\u024F][A-Za-z0-9\u00C0-\u024F .&'+-]*$/.test(name)) return null;
  const origin = new URL(cardUrl).origin;

  const logoRaw = (r.logo && typeof r.logo === "object" ? r.logo : {}) as Record<string, unknown>;
  const logo = {
    mark: sameOriginUrl(logoRaw.mark, origin),
    wordmarkLight: sameOriginUrl(logoRaw.wordmarkLight, origin),
    wordmarkDark: sameOriginUrl(logoRaw.wordmarkDark, origin),
  };

  const updates = Array.isArray(r.updates)
    ? r.updates
        .map((u) => {
          const o = (u && typeof u === "object" ? u : {}) as Record<string, unknown>;
          const date = typeof o.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.date) ? o.date : undefined;
          const title = str(o.title, 200);
          return date && title ? { date, title } : null;
        })
        .filter((u): u is { date: string; title: string } => !!u)
        .slice(0, 8)
    : undefined;

  const rel = (r.release && typeof r.release === "object" ? r.release : {}) as Record<string, unknown>;
  const relId = str(rel.id, 40);
  const builtAt = typeof rel.builtAt === "string" && !Number.isNaN(Date.parse(rel.builtAt)) ? new Date(rel.builtAt).toISOString() : undefined;

  let url: string | undefined;
  const urlRaw = str(r.url, 300);
  if (urlRaw) {
    try {
      const u = new URL(urlRaw);
      if (u.protocol === "https:") url = u.origin;
    } catch {
      /* ignored */
    }
  }

  return {
    name,
    formerNames: strList(r.formerNames, 5, 40),
    tagline: str(r.tagline, 120),
    summary: str(r.summary, 600),
    url,
    status: r.status === "beta" || r.status === "live" || r.status === "in-development" ? r.status : undefined,
    access: r.access === "invite-only" || r.access === "open" ? r.access : undefined,
    accessNote: str(r.accessNote, 100),
    logo: logo.mark || logo.wordmarkLight || logo.wordmarkDark ? logo : undefined,
    highlights: strList(r.highlights, 8, 220),
    updates: updates?.length ? updates : undefined,
    release: relId ? { id: relId, note: str(rel.note, 160), builtAt } : undefined,
  };
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Lay a card over a product's fallback copy. */
export function applyCard(p: Project, card: ProductCard, syncedAt: string): Project {
  // The studio's own paragraphs (problem, approach, ethics) name the product; keep them in step
  // with a rename instead of showing the old name next to the new one.
  const oldNames = [p.name, ...(p.formerNames ?? []), ...(card.formerNames ?? [])].filter((n) => n && n !== card.name);
  const rename = (text: string) =>
    oldNames.reduce((t, n) => t.replace(new RegExp(`\\b${escapeRe(n)}\\b`, "g"), card.name), text);

  const access = card.access === "open" ? undefined : card.access ?? p.access;
  return {
    ...p,
    name: card.name,
    formerNames: Array.from(new Set([...(card.formerNames ?? []), ...(p.formerNames ?? []), ...(p.name !== card.name ? [p.name] : [])])).filter((n) => n !== card.name),
    shortTagline: card.tagline ?? p.shortTagline,
    tagline: card.summary ?? p.tagline,
    status: card.status === "live" ? "shipping" : card.status ? "in-development" : p.status,
    appUrl: card.url ?? p.appUrl,
    access,
    accessNote: access ? card.accessNote ?? p.accessNote : undefined,
    problem: rename(p.problem),
    approach: rename(p.approach),
    ethics: p.ethics.map(rename),
    highlights: card.highlights ?? p.highlights,
    logo: card.logo ?? p.logo,
    updates: card.updates ?? p.updates,
    release: card.release ?? p.release,
    syncedAt,
  };
}

async function readCard(cardUrl: string): Promise<ProductCard | null> {
  try {
    const res = await fetch(cardUrl, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: CARD_REVALIDATE, tags: ["product-cards"] },
    });
    if (!res.ok) return null;
    return parseCard(await res.json(), cardUrl);
  } catch {
    return null;
  }
}

async function live(p: Project): Promise<Project> {
  if (!p.cardUrl) return p;
  const card = await readCard(p.cardUrl);
  return card ? applyCard(p, card, new Date().toISOString()) : p;
}

/** Every product, with the linked ones read live from their own cards. */
export async function getLiveProjects(): Promise<Project[]> {
  return Promise.all(projects.map(live));
}

export async function getLiveProject(slug: string): Promise<Project | undefined> {
  const p = projects.find((x) => x.slug === slug);
  return p ? live(p) : undefined;
}
