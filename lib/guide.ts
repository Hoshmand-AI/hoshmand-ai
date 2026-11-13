import { projects, type Project } from "./projects";
import { site } from "./site";

// The on-site guide. It answers from what is on this site (no model call, nothing leaves
// the browser) and returns actions it can carry out for the visitor.

export type GuideAction =
  | { kind: "navigate"; label: string; href: string }
  | { kind: "external"; label: string; href: string }
  | { kind: "waitlist"; label: string; slug: string; name: string }
  | { kind: "copy"; label: string; text: string };

export interface GuideReply {
  text: string;
  actions: GuideAction[];
}

const has = (q: string, ...words: string[]) => words.some((w) => q.includes(w));

function productActions(p: Project): GuideAction[] {
  const actions: GuideAction[] = [];
  if (p.appUrl) actions.push({ kind: "external", label: `Open ${p.name}`, href: p.appUrl });
  actions.push({ kind: "waitlist", label: p.access === "invite-only" ? "Join the waitlist" : "Notify me when it ships", slug: p.slug, name: p.name });
  actions.push({ kind: "navigate", label: "See full details", href: `/products/${p.slug}` });
  return actions;
}

function productReply(p: Project, lead = ""): GuideReply {
  const access =
    p.access === "invite-only"
      ? ` It's invite-only right now${p.accessNote ? ` (${p.accessNote})` : ""}, so you'll need an invite to get in.`
      : " It isn't released yet.";
  return { text: `${lead}${p.tagline}${access}`, actions: productActions(p) };
}

// What a visitor might be trying to get done → the product built for it.
const NEEDS: { slug: string; words: string[] }[] = [
  { slug: "mailhandled", words: ["email", "e-mail", "inbox", "gmail", "outlook", "calendar", "subscription", "attachment", "mail", "reply", "replies"] },
  { slug: "planora", words: ["construction", "schedule", "primavera", "p6", "ms project", "critical path", "contractor", "project plan", "gantt", "delay"] },
  { slug: "safeclaw", words: ["whatsapp", "linkedin", "message", "notes", "voice", "on my mac", "accounts", "notification", "dm", "twitter"] },
];

export const SUGGESTIONS = [
  "What do you build?",
  "Help me with my inbox",
  "How do I get an invite?",
  "Who is behind Hoshmand AI?",
];

export function suggestionsFor(pathname: string): string[] {
  const p = projects.find((x) => pathname === `/products/${x.slug}`);
  if (p) return [`How do I try ${p.name}?`, `What does ${p.name} do?`, "Show me the other products", "How do I contact you?"];
  if (pathname.startsWith("/contact")) return ["How do I contact you?", "Do you have Instagram?", "What do you build?"];
  if (pathname.startsWith("/about")) return ["Who is behind Hoshmand AI?", "What does responsible AI mean here?", "What do you build?"];
  return SUGGESTIONS;
}

export function reply(raw: string): GuideReply {
  const q = ` ${raw.toLowerCase().replace(/[?!.,]/g, " ").replace(/\s+/g, " ").trim()} `;
  const named = projects.find((p) => q.includes(p.name.toLowerCase()) || q.includes(p.slug));

  // Greetings
  if (/^ (hi|hello|hey|salam|salaam|good (morning|afternoon|evening)) /.test(q) && q.trim().split(" ").length <= 3) {
    return {
      text: `Hi! I'm the ${site.name} guide. Tell me what you're trying to get done, or ask about a product, and I'll take you there.`,
      actions: [{ kind: "navigate", label: "See all products", href: "/products" }],
    };
  }

  // Getting access
  if (has(q, "invite", "access", "beta", "sign up", "signup", "join", "waitlist", " try ", "get in", "log in", "login")) {
    if (named) return productReply(named, `Here's how to try ${named.name}. `);
    const beta = projects.filter((p) => p.access === "invite-only");
    return {
      text: `${beta.map((p) => p.name).join(" and ")} are open by invitation only right now. Join a waitlist and we'll email you when a spot opens. Which one?`,
      actions: projects.map((p) => ({ kind: "waitlist" as const, label: `${p.name} waitlist`, slug: p.slug, name: p.name })),
    };
  }

  // A named product
  if (named) return productReply(named);

  // A need that maps to a product
  const need = NEEDS.find((n) => n.words.some((w) => q.includes(w)));
  if (need) {
    const p = projects.find((x) => x.slug === need.slug);
    if (p) return productReply(p, `${p.name} is built for that. `);
  }

  // Pricing (nothing announced: say so plainly)
  if (has(q, "price", "pricing", "cost", "free", "paid", "how much", "plan ")) {
    return {
      text: "Pricing hasn't been announced yet. The products are in private beta or still in development. Join a waitlist and you'll hear as soon as there's news.",
      actions: projects.map((p) => ({ kind: "waitlist" as const, label: `${p.name} waitlist`, slug: p.slug, name: p.name })),
    };
  }

  // Contact
  if (has(q, "contact", "support", "reach", "talk to", "get in touch", "partnership", "press", "hire")) {
    return {
      text: `The fastest way is email: ${site.supportEmail}. Replies usually come within 24–48 hours.`,
      actions: [
        { kind: "copy", label: "Copy email address", text: site.supportEmail },
        { kind: "external", label: "Write an email", href: `mailto:${site.supportEmail}` },
        { kind: "navigate", label: "Open the Contact page", href: "/contact" },
      ],
    };
  }

  // Social
  if (has(q, "instagram", "social", "follow", "linkedin", "reel", "post")) {
    return {
      text: `We post product updates on Instagram as ${site.instagramHandle}.`,
      actions: [
        { kind: "external", label: "Open Instagram", href: site.instagramUrl },
        { kind: "external", label: "Founder on LinkedIn", href: site.linkedinUrl },
      ],
    };
  }

  // Ethics and privacy
  if (has(q, "ethic", "responsible", "privacy", "private", "safe", "trust", "data", "secure")) {
    return {
      text: "Responsible AI is the foundation here, not a feature. Every product keeps a person in control: MailHandled sends nothing until you press the button, SafeClaw has no way to send or post at all, and Planora explains its reasoning. Each product page lists its commitments under Ethics.",
      actions: [
        { kind: "navigate", label: "Read how we work", href: "/about" },
        { kind: "navigate", label: "See the products", href: "/products" },
      ],
    };
  }

  // About
  if (has(q, "who ", "about", "founder", "behind", "company", "studio", "team", "story", "ahmad", "where are you")) {
    return {
      text: `${site.name} is an independent AI studio founded by ${site.founderName}, based in Virginia. It builds practical AI products that reduce cognitive load and help people follow through.`,
      actions: [
        { kind: "navigate", label: "Read our story", href: "/about" },
        { kind: "external", label: "Founder on LinkedIn", href: site.linkedinUrl },
      ],
    };
  }

  // Products overview
  if (has(q, "product", "build", "make", "offer", "apps", "what do you", "what can", "show me", "everything", "other")) {
    return {
      text: `We're building ${projects.length} products: ${projects.map((p) => p.name).join(", ")}. Pick one and I'll tell you what it does.`,
      actions: [
        ...projects.map((p) => ({ kind: "navigate" as const, label: p.name, href: `/products/${p.slug}` })),
        { kind: "navigate", label: "See them side by side", href: "/products" },
      ],
    };
  }

  return {
    text: "I can only answer from what's on this site, and I don't have that one. I can tell you about our products, how to get an invite, or how to reach us.",
    actions: [
      { kind: "navigate", label: "See all products", href: "/products" },
      { kind: "copy", label: "Copy our email", text: site.supportEmail },
    ],
  };
}
