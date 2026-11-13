import type { Config } from "tailwindcss";
import tokens from "./design/tokens.json";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "DM Sans", "sans-serif"],
        serif: ["var(--font-serif)", "DM Serif Display", "serif"],
      },
      // Colour system (design/tokens.json): one primary in ten shades, neutrals in ten,
      // and success / warning / error at 100 / 500 / 700. Named, never picked by eye.
      // navy / gold / warm are the brand's names for primary / accent / neutral.
      colors: {
        primary: tokens.primary,
        accent: tokens.accent,
        neutral: tokens.neutral,
        success: tokens.success,
        warning: tokens.warning,
        error: tokens.error,
        navy: tokens.primary,
        gold: tokens.accent,
        warm: tokens.neutral,
      },
      // Type scale: [size, { lineHeight, letterSpacing }]. Tracking tightens as size grows.
      fontSize: {
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
        small: ["0.8125rem", { lineHeight: "1.5" }],
        body: ["0.9375rem", { lineHeight: "1.65" }],
        lead: ["1.125rem", { lineHeight: "1.6" }],
        title: ["1.125rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        heading: ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        display: ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
