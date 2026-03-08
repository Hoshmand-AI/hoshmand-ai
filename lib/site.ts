export const site = {
  name: "Hoshmand AI",
  domain: "hoshmand.ai",
  url: "https://hoshmand.ai",
  supportEmail: "support@hoshmand.ai",
  founderName: "Ahmad Nesar Sediqzada",
  linkedinUrl: "https://linkedin.com/in/ahmadsediqzada",
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
