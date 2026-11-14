import "./globals.css";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/motion/MotionProvider";
import ScrollProgress from "@/components/motion/ScrollProgress";
import Guide from "@/components/guide/Guide";
import { getLiveProjects } from "@/lib/live";
import StructuredData from "@/components/StructuredData";

// Self-hosted at build time: no render-blocking request to Google Fonts.
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Responsible AI`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ["AI", "artificial intelligence", "productivity", "MailHandled", "RunF9", "construction scheduling", "email assistant", "AI ethics", "responsible AI"],
  authors: [{ name: site.founderName }],
  creator: site.founderName,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Responsible AI`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Responsible AI`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FDFCFA",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const products = await getLiveProjects();
  return (
    <html lang="en" className={`scroll-smooth ${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-warm-50 font-sans text-warm-600 antialiased">
        <MotionProvider>
          <ScrollProgress />
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Guide products={products} />
          <StructuredData products={products} />
        </MotionProvider>
      </body>
    </html>
  );
}
