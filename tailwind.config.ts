import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        violet: {
          DEFAULT: "#b8a0d8",
          dim: "#8a72a8",
          bright: "#d4c0f0",
        },
        gold: {
          DEFAULT: "#e8d8a8",
          dim: "#c4b070",
          bright: "#f8f0d0",
        },
        cosmic: {
          black: "#000000",
          dark: "#0a0a12",
          card: "#0d0d1a",
          border: "#1a1a2e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "cosmic-gradient": "radial-gradient(ellipse at top, #1a0a2e 0%, #000000 60%)",
        "violet-glow": "radial-gradient(circle, rgba(184,160,216,0.15) 0%, transparent 70%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(184,160,216,0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(184,160,216,0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
