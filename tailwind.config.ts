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
        // Vibrant hot pink primary (CookedResume-inspired)
        primary: {
          50: "#FFF0F3",
          100: "#FFE0E8",
          200: "#FFC2D1",
          300: "#FF94AD",
          400: "#FF5C82",
          500: "#E8436B",
          600: "#D12F5A",
          700: "#B02049",
          800: "#931D40",
          900: "#7D1C3B",
        },
        // Warm neutral grays
        neutral: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
