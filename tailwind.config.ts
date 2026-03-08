import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
      },
      colors: {
        navy: {
          950: "#0A1628",
          900: "#0F2140",
          800: "#162D54",
          700: "#1E3A6A",
        },
        gold: {
          600: "#B8862E",
          500: "#C8963E",
          400: "#D4A94F",
          100: "#FDF6E9",
        },
        warm: {
          50:  "#FDFCFA",
          100: "#F8F6F3",
          200: "#F0EDE8",
          300: "#E2DDD5",
          400: "#B8B0A4",
          500: "#8A8178",
          600: "#6B6359",
          700: "#4A443C",
        },
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
