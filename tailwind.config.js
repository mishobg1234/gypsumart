import { withUt } from "uploadthing/tw";

/** @type {import('tailwindcss').Config} */
export default withUt({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ArtBuild Brand Colors
        brand: {
          green: '#0F6A43',
          'green-light': '#3ED27A',
          orange: '#FF8A00',
        },
        neutral: {
          white: '#FFFFFF',
          light: '#F5F5F5',
          dark: '#1A1A1A',
        },
        // Legacy
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
});