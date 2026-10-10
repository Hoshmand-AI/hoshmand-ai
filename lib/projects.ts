export type ProjectStatus = "shipping" | "in-development";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  status: ProjectStatus;
  expectedShip?: string;
  liveUrl?: string;
  appStoreUrl?: string;
  screenshot?: string;
  problem: string;
  approach: string;
  highlights: string[];
  ethics: string[];
  artifact?: { label: string; href: string };
  customPage?: boolean;
}

export const projects: Project[] = [
  // ─── Shipping ────────────────────────────────────────────────────────────
  {
    slug: "mindcue",
    name: "MindCue AI",
    tagline: "Smart reminders from screenshots.",
    status: "shipping",
    appStoreUrl: "https://apps.apple.com/us/app/mindcue-ai/id6757585894",
    problem:
      "Screenshots pile up silently. You capture something intending to act on it, then forget it exists.",
    approach:
      "MindCue reads your screenshots with on-device AI, extracts the intent, and schedules staggered reminders that link back to the right app or action.",
    highlights: [
      "AI-powered screenshot understanding",
      "Staggered reminder follow-ups (no pileups)",
      "Deep links to apps and actions",
      "Full-screen reminder experience",
      "Privacy-minded defaults",
    ],
    ethics: [
      "On-device processing keeps your screenshots private",
      "No account required to use core features",
      "Designed to reduce notification fatigue, not add to it",
    ],
    customPage: true,
  },

  // ─── In Development ──────────────────────────────────────────────────────
  {
    slug: "care360",
    name: "Care360",
    tagline:
      "Care360 helps you understand your symptoms and what to do next, while always reminding you to check with a real doctor. It's careful, honest, and never pretends to replace your doctor.",
    status: "in-development",
    expectedShip: "Q4 2026",
    problem:
      "Most AI symptom checkers optimize for engagement, not accuracy or safety. They give confident answers without uncertainty, sources, or appropriate escalation.",
    approach:
      "Care360 is the improved arm of a paired study comparing responsible vs. irresponsible AI design in healthcare. It surfaces uncertainty, cites sources, and always recommends professional care when appropriate.",
    highlights: [
      "Uncertainty quantification on every response",
      "Source citations for medical claims",
      "Clear escalation prompts when symptoms are serious",
      "Paired study design — benchmarked against a baseline",
    ],
    ethics: [
      "Built as a research project — not a replacement for professional care",
      "Paired with an irresponsible baseline to demonstrate the stakes of AI design choices",
      "Final project for GMU Ethics of AI",
    ],
    artifact: {
      label: "Read the GMU Ethics of AI report",
      href: "/care360-report.pdf",
    },
  },
  {
    slug: "mailhandled",
    name: "MailHandled",
    tagline:
      "MailHandled reads your email, tells you which messages need you, and writes replies for you to check. Nothing gets sent until you press the button.",
    status: "in-development",
    expectedShip: "Q4 2026",
    problem:
      "Inboxes mix the few messages that need you with ads, codes, and notifications. Sorting them, remembering the meetings buried inside them, and writing replies eats hours of attention every week.",
    approach:
      "MailHandled is an email chief of staff built on Claude. It triages Gmail and Outlook inboxes, captures calendar events and attachments, writes a daily brief, and drafts replies that wait in an approval queue until you send them.",
    highlights: [
      "Gmail and Outlook / Microsoft 365 triage with labels",
      "Reply drafts and calendar events wait in an approval queue",
      "One daily brief across every connected account",
      "Attachments filed to Drive with links back to the email",
    ],
    ethics: [
      "Human-in-the-loop by default: nothing is sent without your approval",
      "Deliberately limited to email, calendar, and files",
      "Official platform APIs only, no automation of personal messaging apps",
    ],
  },
  {
    slug: "safeclaw",
    name: "SafeClaw",
    tagline:
      "SafeClaw watches the email and message apps you already have open on your Mac and keeps a short list of what needs you. You can ask it out loud what's new, and it gets a reply ready, but it never sends anything for you.",
    status: "in-development",
    expectedShip: "Q4 2026",
    problem:
      "Messages that matter arrive across Gmail, Outlook, LinkedIn, WhatsApp, X, and more. Checking every account for what needs you is constant, scattered work, and most assistants that help ask for broad permission to act on your behalf.",
    approach:
      "SafeClaw reads the accounts you keep open in one browser on your Mac and keeps a short list of notes, each linked to where it came from. Ask it by voice or text, have a message read to you, and dictate a reply it prepares for you to send yourself.",
    highlights: [
      "Watches Gmail, Outlook, LinkedIn, WhatsApp, X, and others in one browser",
      "Ask by voice or text, with every note linked to its source",
      "Runs with a model on your Mac, or a cloud model on your own key",
      "Optional phone view over your private Tailscale network",
    ],
    ethics: [
      "No mechanism to send, post, like, follow, purchase, or delete",
      "With a model on your Mac, nothing leaves the device; no telemetry",
      "Everything it keeps is plain text you can export or delete",
    ],
  },
  {
    slug: "planora",
    name: "Planora",
    tagline:
      "Planora reads a big construction schedule and explains it in plain words — what's on track, what's late, and what matters most — so you don't need to pay an expensive expert.",
    status: "in-development",
    expectedShip: "Q4 2026",
    problem:
      "Reading a Primavera P6 or MS Project schedule requires years of domain expertise. Most project teams pay $200/hr consultants to answer questions the data already contains.",
    approach:
      "Upload a schedule. Planora parses it, identifies the critical path, flags variance, and answers natural-language questions — built by a 13-year construction scheduling professional who managed schedules at Meta, USPS, and Applied Digital.",
    highlights: [
      "Primavera P6 and MS Project support",
      "Critical path identification",
      "Schedule variance analysis",
      "Natural language Q&A over your schedule",
    ],
    ethics: [
      "Built by a domain expert — not a generalist AI wrapping P6 docs",
      "Transparent about what the model can and cannot infer",
      "Experimental — not a substitute for professional schedule review",
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getShippingProjects(): Project[] {
  return projects.filter((p) => p.status === "shipping");
}

export function getInDevProjects(): Project[] {
  return projects.filter((p) => p.status === "in-development");
}
