import { site } from "@/lib/site";
import type { Project } from "@/lib/projects";

// Facts about the studio in the form search engines read (schema.org JSON-LD). Without this, search
// answers guess: one said the studio was founded in 1995. The products come from the live list, so
// a rename in a product reaches search engines on their next crawl too.
export default function StructuredData({ products }: { products: Project[] }) {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/hoshmand-mark-512.png`,
    email: site.supportEmail,
    description: site.description,
    foundingDate: String(site.foundingYear),
    founder: { "@type": "Person", name: site.founderName, sameAs: [site.linkedinUrl] },
    address: { "@type": "PostalAddress", addressRegion: "VA", addressCountry: "US" },
    sameAs: [site.instagramUrl, site.linkedinUrl],
    makesOffer: products.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "SoftwareApplication",
        name: p.name,
        description: p.shortTagline ?? p.tagline,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: p.appUrl ?? `${site.url}/products/${p.slug}`,
        ...(p.formerNames?.length ? { alternateName: p.formerNames } : {}),
      },
    })),
  };
  const website = { "@context": "https://schema.org", "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, publisher: { "@id": `${site.url}/#organization` } };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot close the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify([org, website]).replace(/</g, "\\u003c") }}
    />
  );
}
