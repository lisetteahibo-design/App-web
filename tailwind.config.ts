import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef1f7",
          100: "#d7deec",
          200: "#b0bdd9",
          300: "#8497c0",
          400: "#5b71a3",
          500: "#3d5384",
          600: "#2b3f6b",
          700: "#1f3057",
          800: "#15213e",
          900: "#0c1526",
          950: "#070c17",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(12,21,38,0.06), 0 1px 3px 0 rgba(12,21,38,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
