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
        sand: {
          50: "#FAF8F5",
          100: "#F4EFE6",
          200: "#E8DFD1",
          300: "#D7CABC",
          400: "#C2B2A0",
          500: "#8A7A68",
          900: "#2B2620",
        },
        charcoal: {
          800: "#242724",
          900: "#181A18",
          950: "#0F110F",
        },
        terracotta: {
          50: "#FBF3EF",
          100: "#F6E4DC",
          500: "#BA5D38",
          600: "#A24E2D",
          700: "#863E21",
        },
        olive: {
          50: "#F4F6F4",
          100: "#E5EBE5",
          600: "#495848",
          700: "#3A4739",
          800: "#2B352A",
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
