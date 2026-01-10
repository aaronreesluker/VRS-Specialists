import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fee2e2",
          100: "#fecaca",
          500: "#E11C22",
          600: "#E11C22",
          700: "#b91c1c",
          900: "#7f1d1d",
        },
        brand: {
          red: "#E11C22",
          silver: "#A8A9A9",
          "dark-grey": "#6C6C6B",
        },
        dark: {
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          800: "#343a40",
          900: "#212529",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

