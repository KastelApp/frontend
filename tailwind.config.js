/* eslint-disable import/no-anonymous-default-export */
import { nextui } from "@nextui-org/react";
import scrollbar from "tailwind-scrollbar"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "white": "#CFDBFF",
        "background": "#161922",
        "primary": "#9aa9e0",
        "secondary": "#8446c7",
        "accent": "#101319",
        "mention": "hsl( 40 86.4% 56.9% / 0.1)"
       },
       fontSize: {
        "2xs": ".625rem",
        "3xs": ".5rem",
        "4xs": ".375rem",
        "5xs": ".25rem",
       }
    },
    fontFamily: {
      "roboto": ["Roboto", "sans-serif"],
    }
  },
  darkMode: "class",
  plugins: [nextui({
    defaultTheme: "dark",
    themes: {
      dark: {
        colors: {
          background: "#161922",
          primary: "#9aa9e0",
          secondary: "#624185",
        }
      }
    },
  }), scrollbar()],
};
