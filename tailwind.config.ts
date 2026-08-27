import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#162B3A",
          light: "#28566B",
        },
        brand: {
          50: "#e6f7f6",
          100: "#c2ece9",
          500: "#16A6A1",
          600: "#16A6A1",
          700: "#0E817D",
        },
        success: "#3BAA72",
        warning: "#E9A23B",
        danger: "#D95C5C",
        surface: "#FFFFFF",
        background: "#F7F8F6",
        charcoal: "#172026",
        slate: "#64727A",
      },
    },
  },
  plugins: [],
};

export default config;
