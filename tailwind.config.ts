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
        // Primary Palette (UnfoldCRO brand)
        accent: "#00C853",
        "accent-hover": "#00B848",
        dark: "#0f1115",
        // Aliases for backward compat (existing classes still work)
        gold: "#00C853",
        earth: "#0f1115",
        "green-seva": "#00C853",
        "orange-seva": "#FF6D00",

        // Gender Cards (UnfoldCRO pastels)
        "card-male": "#D9DEFC",
        "card-female": "#F7CBE6",
        "card-other": "#F0FCB0",
        "card-deceased": "#E7E9EE",

        // Semantic
        success: "#16A34A",
        warning: "#EAB308",
        info: "#3B82F6",
        error: "#DC2626",

        // Surfaces
        "bg-primary": "#f6f7f9",
        "bg-card": "#FFFFFF",
        "bg-muted": "#f0f1f3",
        "border-warm": "#e7e9ee",
      },
      fontFamily: {
        heading: [
          "var(--font-dm-sans)",
          "var(--font-noto-sans-devanagari)",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "var(--font-poppins)",
          "var(--font-noto-sans-devanagari)",
          "system-ui",
          "sans-serif",
        ],
        hindi: ["var(--font-noto-sans-devanagari)", "sans-serif"],
        sans: [
          "var(--font-poppins)",
          "var(--font-noto-sans-devanagari)",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-poppins)", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "50px",
        input: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
