/**
 * Jayraj Fabrication — Digital Ecosystem
 * @author Aryan Rajendra Suthar <aryanrajendrasuthar@gmail.com>
 * @license Private — See LICENSE.md
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // JF Brand
        "jf-lime":      "#6BBF3A",
        "jf-lime-dark": "#4A8A28",
        "jf-lime-glow": "#8FD654",
        "jf-gold":      "#C9A84C",
        "jf-steel":     "#708090",
        // Dark theme backgrounds
        "jf-bg":        "#0D0D0D",
        "jf-bg-2":      "#141414",
        "jf-bg-3":      "#1C1C1C",
        "jf-bg-section":"#111827",
        // Light theme
        "jf-light":     "#F8F8F6",
        "jf-charcoal":  "#1A1A1A",
        // Semantic
        "jf-danger":    "#E53E3E",
      },
      fontFamily: {
        display:  ["var(--font-barlow-condensed)", "sans-serif"],
        heading:  ["var(--font-barlow)", "sans-serif"],
        body:     ["var(--font-inter)", "sans-serif"],
        mono:     ["var(--font-space-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "marquee":    "marquee 40s linear infinite",
        "marquee-r":  "marquee-r 40s linear infinite",
        "count-up":   "count-up 2s ease-out forwards",
        "fade-up":    "fade-up 0.5s ease-out forwards",
        "bounce-dot": "bounce-dot 1.4s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-r": {
          "0%":   { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-dot": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
