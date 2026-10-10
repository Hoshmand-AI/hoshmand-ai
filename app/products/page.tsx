import type { Metadata } from "next";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import InDevCard from "@/components/InDevCard";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { site } from "@/lib/site";
import { getShippingProjects, getInDevProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Products",
  description: "AI products built by Hoshmand AI — shipping and in development.",
};

function SectionHeading({ title, count, tone }: { title: string; count: string; tone: "green" | "gold" }) {
  const green = tone === "green";
  return (
    <Reveal className="mb-10 flex items-center gap-3">
      <h2 className="text-[2rem] sm:text-[2.4rem]">{title}</h2>
      <span
        className="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
        style={{
          borderColor: green ? "rgba(61,139,110,0.25)" : "rgba(200,150,62,0.3)",
          backgroundColor: green ? "rgba(61,139,110,0.08)" : "rgba(200,150,62,0.08)",
          color: green ? "#3D8B6E" : "#B8862E",
        }}
      >
        {count}
      </span>
    </Reveal>
  );
}

export default function ProductsPage() {
  const shipping = getShippingProjects();
  const inDev = getInDevProjects();

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="What we're shipping and building."
        description="One product live. Four in active development. Every one grounded in responsible AI principles."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading title="Shipping" count={`${shipping.length} live`} tone="green" />
          <div className="grid gap-6">
            {shipping.map((p) => (
              <Reveal key={p.slug}>
                <ProductCard
                  title={p.name}
                  tagline={p.tagline}
                  status="Available on iOS"
                  href={p.customPage ? `/${p.slug}` : `/products/${p.slug}`}
                  appStoreUrl={p.appStoreUrl}
                  bullets={p.highlights}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-warm-200 bg-warm-100 py-20 sm:py-28">
        <Container>
          <SectionHeading title="In Development" count={`${inDev.length} active`} tone="gold" />
          <RevealGroup className="grid gap-6 md:grid-cols-2">
            {inDev.map((p) => (
              <RevealItem key={p.slug} className="h-full">
                <InDevCard project={p} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="border-t border-warm-200 py-12">
        <Container>
          <p className="text-center text-[13px] text-warm-400">
            All products are built by <span className="font-medium text-warm-600">{site.name}</span>
          </p>
        </Container>
      </section>
    </>
  );
}
