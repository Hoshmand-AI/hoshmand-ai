import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/products", "/about", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...projects.map((p) => ({ url: `${site.url}/products/${p.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 })),
  ];
}
