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
        },
        sage: {
          50: "#F5F8F5",
          100: "#E7EFE6",
          200: "#D2E0D1",
          300: "#B4CAB3",
          400: "#91AF90",
          500: "#6B8E68",
          600: "#557352",
          700: "#445C42",
          800: "#374A35",
          900: "#2A3829",
        },
        cream: {
          50: "#FDFBF7",
          100: "#FAF6EE",
          200: "#F4EDDD",
          300: "#ECE0C7",
          400: "#DECBA6",
          500: "#CBB383",
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      fontSize: {
        // 5-Tier Typography System
        'meta': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.14em' }], // 10px - Micro metadata & brand badges
        'body-sm': ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0' }], // 12px - Body & price details
        'title-sm': ['0.8125rem', { lineHeight: '1.125rem', letterSpacing: '-0.005em' }], // 13px - Compact product title
        'title-md': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '-0.01em' }], // 14px - Primary product title & action label
        'heading-sm': ['1rem', { lineHeight: '1.375rem', letterSpacing: '-0.01em' }], // 16px - Section & card header
        'heading-md': ['1.125rem', { lineHeight: '1.5rem', letterSpacing: '-0.015em' }], // 18px - Prominent card title
        'display-sm': ['1.5rem', { lineHeight: '1.875rem', letterSpacing: '-0.02em' }], // 24px - Mobile page & hero title
        'display-md': ['2rem', { lineHeight: '2.375rem', letterSpacing: '-0.025em' }], // 32px - Desktop hero title
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
export default config;
