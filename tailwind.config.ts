import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      // Bumped up from Tailwind's defaults for quick, high-glare reading
      // (checking the app in the car), without touching the spacing
      // scale used for layout/sizing.
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.15rem" }],
        sm: ["1rem", { lineHeight: "1.5rem" }],
        base: ["1.125rem", { lineHeight: "1.75rem" }],
        lg: ["1.25rem", { lineHeight: "1.85rem" }],
        xl: ["1.4rem", { lineHeight: "1.9rem" }],
        "2xl": ["1.75rem", { lineHeight: "2.15rem" }],
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
        background: "#EDEFE9",
        charcoal: "#172026",
        slate: "#64727A",
        // Darker overrides of Tailwind's default gray shades — the app's
        // secondary/hint text uses these, and the defaults were too
        // washed out to read in bright sunlight.
        gray: {
          400: "#6B7680",
          500: "#4B5563",
          600: "#313C46",
          700: "#1F2933",
        },
      },
    },
  },
  plugins: [],
};

export default config;
