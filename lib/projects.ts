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
    slug: "atlas",
    name: "Atlas",
    tagline: "Local-first personal RAG for iOS and macOS.",
    status: "in-development",
    expectedShip: "Q4 2026",
    problem:
      "Your notes, docs, and files are scattered across apps. Finding something you wrote six months ago means remembering exactly where you put it.",
    approach:
      "Atlas builds a private, on-device vector index of your personal documents. Ask it anything — it retrieves from your own data, never a cloud.",
    highlights: [
      "Fully local — your data never leaves your device",
      "Indexes notes, PDFs, and documents",
      "Natural language retrieval",
      "iOS and macOS native (Swift)",
    ],
    ethics: [
      "Zero cloud dependency for core retrieval",
      "No training on user data",
      "Transparent about what is and isn't indexed",
    ],
  },
  {
    slug: "care360",
    name: "Care360",
    tagline: "Responsible-AI symptom checker — paired study, improved arm.",
    status: "in-development",
    expectedShip: "Q4 2026",
    liveUrl: "https://care360-responsible-ai.vercel.app",
    screenshot: "/screenshots/care360.png",
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
    slug: "storifai",
    name: "Storifai",
    tagline: "Three story versions from a single image upload.",
    status: "in-development",
    expectedShip: "Q4 2026",
    liveUrl: "https://storifai-improved.vercel.app",
    screenshot: "/screenshots/storifai.png",
    problem:
      "Image captioning models generate generic descriptions. They don't tell stories — and they don't give you creative control.",
    approach:
      "Upload an image. Storifai uses CLIP + Cross-Image Attention + Transformer Decoder to generate three tonally distinct story versions. Built as a CS747 computer vision project with BLEU benchmark evaluation.",
    highlights: [
      "Three story variants per upload (literary, journalistic, imaginative)",
      "CLIP + Cross-Image Attention + Transformer Decoder architecture",
      "BLEU score benchmarking against baseline",
      "CVPR-format research paper",
    ],
    ethics: [
      "Evaluated against a baseline to measure actual improvement",
      "Transparent about model architecture and limitations",
      "Research-grade — not production storytelling software",
    ],
    artifact: {
      label: "Read the CS747 paper",
      href: "/storifai-report.pdf",
    },
  },
  {
    slug: "qissa",
    name: "Qissa",
    tagline: "Personalized children's storybooks in English, Dari, Pashto, and Arabic.",
    status: "in-development",
    expectedShip: "Q4 2026",
    liveUrl: "https://qissa-ivory.vercel.app",
    screenshot: "/screenshots/qissa.png",
    problem:
      "Children's books rarely reflect the cultural backgrounds of multilingual families. Afghan and Arabic-speaking families in the US have almost no personalized options.",
    approach:
      "Qissa generates illustrated storybooks personalized to a child's name, interests, and cultural background — in English, Dari, Pashto, and Arabic.",
    highlights: [
      "Four language support: English, Dari, Pashto, Arabic",
      "Culturally aware story generation",
      "Personalized to the child's name and interests",
      "Illustrated output",
    ],
    ethics: [
      "Built with cultural sensitivity as a core design requirement",
      "No child data retained after story generation",
      "Language choices reflect real underserved communities",
    ],
  },
  {
    slug: "planora",
    name: "Planora",
    tagline: "Construction schedule analysis. $200/hr consultant replaced.",
    status: "in-development",
    expectedShip: "Q4 2026",
    liveUrl: "https://planora-chi.vercel.app",
    screenshot: "/screenshots/planora.png",
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
