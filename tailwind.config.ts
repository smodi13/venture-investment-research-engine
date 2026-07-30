import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0f1216",
          soft: "#434a54",
          muted: "#737d8c",
        },
        line: {
          DEFAULT: "#e4e7ec",
          strong: "#cfd4dd",
        },
        surface: "#ffffff",
        canvas: "#f6f7f9",
        accent: {
          DEFAULT: "#1a56db",
          hover: "#1443b0",
          soft: "#eef2ff",
          line: "#c7d3f7",
        },
        /** Used for the X signal provenance surfaces. */
        signal: {
          DEFAULT: "#0f1216",
          soft: "#f2f3f5",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 18 22 / 0.04)",
        lift: "0 1px 2px 0 rgb(15 18 22 / 0.04), 0 8px 24px -8px rgb(15 18 22 / 0.10)",
        panel: "-8px 0 40px -12px rgb(15 18 22 / 0.18)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(16px)", opacity: "0.6" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.25s ease-out both",
        "slide-in": "slide-in 0.22s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
