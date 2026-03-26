import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette
        gold: "#C9A84C",
        earth: "#1A1207",
        "green-seva": "#2D5A1E",
        "orange-seva": "#D4740E",

        // Gender Cards
        "card-male": "#E8F0FE",
        "card-female": "#FDE8F0",
        "card-other": "#E8F0E8",
        "card-deceased": "#D1D5DB",

        // Semantic
        success: "#16A34A",
        warning: "#EAB308",
        info: "#3B82F6",
        error: "#DC2626",

        // Surfaces
        "bg-primary": "#FFFBF0",
        "bg-card": "#FFFFFF",
        "bg-muted": "#F5F0E8",
        "border-warm": "#E8DCC8",
      },
      fontFamily: {
        sans: [
          "var(--font-noto-sans-devanagari)",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
        hindi: ["var(--font-noto-sans-devanagari)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
