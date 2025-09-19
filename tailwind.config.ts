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
        wood: {
          light: '#A67B5B',
          DEFAULT: '#8B4513',
          dark: '#613915',
          accent: '#DEB887',
        }
      }
    },
  },
  plugins: [],
};

export default config;