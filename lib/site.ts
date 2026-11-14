export const site = {
  name: "Hoshmand AI",
  domain: "hoshmand.ai",
  // The address the site actually serves from: hoshmand.ai redirects here.
  url: "https://www.hoshmand.ai",
  /** The year the studio was founded, for search engines and the About page. */
  foundingYear: 2026,
  supportEmail: "support@hoshmand.ai",
  founderName: "Ahmad Nesar Sediqzada",
  linkedinUrl: "https://linkedin.com/in/ahmadsediqzada",
  instagramUrl: "https://www.instagram.com/hoshmand.ai.studio/",
  instagramHandle: "@hoshmand.ai.studio",
  description:
    "Hoshmand AI is an independent AI studio building responsible, human-centered products that reduce cognitive load and help people follow through.",
  tagline: "Responsible AI, built to turn digital clutter into action.",
  mindcueAppStoreUrl: "https://apps.apple.com/us/app/mindcue-ai/id6757585894",
} as const;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
