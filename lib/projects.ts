export type ProjectStatus = "shipping" | "in-development";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  status: ProjectStatus;
  expectedShip?: string;
  liveUrl?: string;
  /** The product's real web app. Shown as "Open <name>" with an access note. */
  appUrl?: string;
  /** Who can get in once they open appUrl. */
  access?: "invite-only";
  /** Overrides the default "Invite-only beta" note next to the Open button. */
  accessNote?: string;
  /** Where we post updates about this product (e.g. the Instagram page). */
  updatesUrl?: string;
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

  // ─── In Development ──────────────────────────────────────────────────────
  {
    slug: "mailhandled",
    name: "MailHandled",
    tagline:
      "Connect as many email accounts as you want. MailHandled reads and sorts your email, puts all your calendars in one place, saves your files for you, and keeps track of your subscriptions. It writes replies for you to check, and nothing gets sent until you press the button.",
    status: "in-development",
    expectedShip: "Q4 2026",
    appUrl: "https://mailhandled.ai",
    access: "invite-only",
    accessNote: "Private beta · invite only during Google verification",
    updatesUrl: "https://www.instagram.com/hoshmand.ai.studio/",
    problem:
      "Inboxes mix the few messages that need you with ads, codes, and notifications. Sorting them, remembering the meetings buried inside them, and writing replies eats hours of attention every week.",
    approach:
      "MailHandled is an email chief of staff built on Claude. Connect any number of Gmail and Outlook accounts: it triages every inbox, combines your calendars, files attachments automatically, tracks subscriptions found in your email, writes a daily brief, and drafts replies that wait in an approval queue until you send them.",
    highlights: [
      "Connect as many Gmail and Outlook / Microsoft 365 accounts as you want",
      "Reads and sorts every inbox, with reply drafts waiting for your approval",
      "All your calendars from every account combined in one view",
      "Attachments saved to Drive automatically, with links back to the email",
      "Subscriptions tracked across all your email accounts",
    ],
    ethics: [
      "Human-in-the-loop by default: nothing is sent without your approval",
      "Deliberately limited to email, calendar, and files",
      "Official platform APIs only, no automation of personal messaging apps",
    ],
  },
  {
    slug: "planora",
    name: "Planora",
    tagline:
      "Planora reads a big construction schedule and explains it in plain words — what's on track, what's late, and what matters most — so you don't need to pay an expensive expert.",
    status: "in-development",
    expectedShip: "Q4 2026",
    appUrl: "https://planora-chi.vercel.app",
    access: "invite-only",
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
  {
    slug: "safeclaw",
    name: "SafeClaw",
    tagline:
      "Open each of your accounts (email, LinkedIn, WhatsApp, X, and more) in a web browser, and SafeClaw reads them for you and takes notes on the things you care about. You can ask it out loud what's new, and it gets a reply ready, but it never sends anything for you.",
    status: "in-development",
    expectedShip: "Q4 2026",
    problem:
      "Messages that matter arrive across Gmail, Outlook, LinkedIn, WhatsApp, X, and more. Checking every account for what needs you is constant, scattered work, and most assistants that help ask for broad permission to act on your behalf.",
    approach:
      "You open each of your accounts in one web browser, on your Mac or a server of your own. SafeClaw reads them for you and takes notes on what you want to know about, each linked to where it came from. Ask it by voice or text, have a message read to you, and dictate a reply it prepares for you to send yourself.",
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
