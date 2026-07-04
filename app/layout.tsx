import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "Saraf — Autonomous Trading Agent",
    template: "%s | Saraf",
  },
  description:
    "Saraf is an autonomous AI trading agent for Bitcoin, Oil, and Gold. It connects to your own brokerage, decides when to buy and sell under strict risk limits, and proves itself on paper before trading real money. A Hoshmand AI product.",
  applicationName: "Saraf",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/saraf-icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0A1628",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-navy-950 font-sans antialiased">{children}</body>
    </html>
  );
}
