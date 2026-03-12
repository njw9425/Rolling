import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#08121E",
        navy: "#10243A",
        gold: "#F4B840",
        mint: "#7CE3CF",
        coral: "#FF8A65",
        cloud: "#F5F7FB"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"]
      },
      boxShadow: {
        panel: "0 24px 60px rgba(8, 18, 30, 0.12)"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(244, 184, 64, 0.28), transparent 34%), radial-gradient(circle at 80% 10%, rgba(124, 227, 207, 0.18), transparent 26%)"
      }
    }
  },
  plugins: []
};

export default config;
