import type { Metadata } from "next";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import InDevCard from "@/components/InDevCard";
import { site } from "@/lib/site";
import { getShippingProjects, getInDevProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Products",
  description:
    "AI products built by Hoshmand AI — shipping and in development.",
};

export default function ProductsPage() {
  const shipping = getShippingProjects();
  const inDev = getInDevProjects();

  return (
    <>
      {/* Header */}
      <section className="bg-navy-900 py-16 sm:py-20">
        <Container>
          <p className="eyebrow text-white/40 mb-4">Products</p>
          <h1
            className="max-w-2xl text-4xl sm:text-5xl mb-4"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 400,
              color: "white",
            }}
          >
            What we're shipping and building.
          </h1>
          <p className="max-w-xl text-[15px] text-white/50">
            One product live. Five in active development. Every one grounded in
            responsible AI principles.
          </p>
        </Container>
      </section>

      {/* Shipping */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mb-8 flex items-center gap-3">
            <h2
              className="text-2xl"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 400,
                color: "#0A1628",
              }}
            >
              Shipping
            </h2>
            <span
              className="rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
              style={{
                borderColor: "rgba(61,139,110,0.2)",
                backgroundColor: "rgba(61,139,110,0.08)",
                color: "#3D8B6E",
              }}
            >
              {shipping.length} live
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {shipping.map((p) => (
              <ProductCard
                key={p.slug}
                title={p.name}
                tagline={p.tagline}
                status="Available on iOS"
                href={p.customPage ? `/${p.slug}` : `/products/${p.slug}`}
                appStoreUrl={p.appStoreUrl}
                bullets={p.highlights}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* In Development */}
      <section className="border-t border-warm-200 bg-warm-100 py-16 sm:py-20">
        <Container>
          <div className="mb-8 flex items-center gap-3">
            <h2
              className="text-2xl"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 400,
                color: "#0A1628",
              }}
            >
              In Development
            </h2>
            <span
              className="rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
              style={{
                borderColor: "rgba(200,150,62,0.25)",
                backgroundColor: "rgba(200,150,62,0.07)",
                color: "#B8862E",
              }}
            >
              {inDev.length} active
            </span>
          </div>

          <p className="text-[14px] text-warm-500 mb-10 max-w-xl">
            These are real, working projects — not vaporware. Each has a live
            demo you can try. They're flagged as experimental because they're
            research-grade, not production-ready.
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            {inDev.map((p) => (
              <InDevCard key={p.slug} project={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Attribution */}
      <section className="border-t border-warm-200 py-12">
        <Container>
          <p className="text-[13px] text-warm-400 text-center">
            All products are built by{" "}
            <span className="text-warm-600 font-medium">{site.name}</span>
          </p>
        </Container>
      </section>
    </>
  );
}
