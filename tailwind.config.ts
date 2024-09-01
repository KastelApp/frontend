import { nextui } from "@nextui-org/theme";
import scrollbar from "tailwind-scrollbar";
import plugin from "tailwindcss/plugin.js";
import tailwindAnimate from "tailwindcss-animate";
import type { Config } from "tailwindcss/types/config";

const config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				white: "#CFDBFF",
				darkText: "#CFDBFF",
				lightText: "#000B2E",
				darkBackground: "#161922",
				lightBackground: "#DDE0E9",
				primary: "#008DA5",
				secondary: "#9AA9E0",
				darkAccent: "#101319",
				lightAccent: "#E6E9EF",
				mention: "hsl(40, 86%, 57%, 0.1)",
				"mention-hover": "hsl(40, 86%, 57%, 0.06)",
				"msg-jumped": "hsl(270, 86%, 57%, 0.1)",
				"msg-hover": "rgba(0, 0, 0, 0.1)",
				"msg-system": "hsl(290, 86%, 57%, 0.1)",
				"msg-system-hover": "hsl(290, 86%, 57%, 0.06)",
				charcoal: {
					50: "#f9f9f9",
					100: "#f3f3f3",
					200: "#e0e0e0",
					300: "#cecece",
					400: "#a9a9a9",
					500: "#282F3E",
					600: "#202531",
					700: "#181C25",
					800: "#101218",
					900: "#08090C",
				},
				branding: {
					50: "#8c52ff",
					100: "#8547FF",
					200: "#7733FF",
					300: "#691FFF",
					400: "#5C0AFF",
					500: "#5200F5",
					600: "#4B00E0",
					700: "#4400CC",
					800: "#3D00B8",
					900: "#3600A3",
				},
			},
			fontSize: {
				"2xs": ".625rem",
				"3xs": ".5rem",
				"4xs": ".375rem",
				"5xs": ".25rem",
			},
			border: "hsl(var(--border))",
			input: "hsl(var(--input))",
			ring: "hsl(var(--ring))",
			background: "hsl(var(--background))",
			foreground: "hsl(var(--foreground))",
			primary: {
				DEFAULT: "hsl(var(--primary))",
				foreground: "hsl(var(--primary-foreground))",
			},
			secondary: {
				DEFAULT: "hsl(var(--secondary))",
				foreground: "hsl(var(--secondary-foreground))",
			},
			destructive: {
				DEFAULT: "hsl(var(--destructive))",
				foreground: "hsl(var(--destructive-foreground))",
			},
			muted: {
				DEFAULT: "hsl(var(--muted))",
				foreground: "hsl(var(--muted-foreground))",
			},
			accent: {
				DEFAULT: "hsl(var(--accent))",
				foreground: "hsl(var(--accent-foreground))",
			},
			popover: {
				DEFAULT: "hsl(var(--popover))",
				foreground: "hsl(var(--popover-foreground))",
			},
			card: {
				DEFAULT: "hsl(var(--card))",
				foreground: "hsl(var(--card-foreground))",
			},
		},
		keyframes: {
			"accordion-down": {
				from: { height: "0" },
				to: { height: "var(--radix-accordion-content-height)" },
			},
			"accordion-up": {
				from: { height: "var(--radix-accordion-content-height)" },
				to: { height: "0" },
			},
			"caret-blink": {
				"0%,70%,100%": { opacity: "1" },
				"20%,50%": { opacity: "0" },
			},
		},
		animation: {
			"accordion-down": "accordion-down 0.2s ease-out",
			"accordion-up": "accordion-up 0.2s ease-out",
			"caret-blink": "caret-blink 1.25s ease-out infinite",
		},
	},
	darkMode: "class",
	plugins: [
		nextui({
			defaultTheme: "dark",
			themes: {
				dark: {
					colors: {
						background: "#161922",
						primary: "#008DA5",
						secondary: "#624185",
					},
				},
				light: {
					colors: {
						background: "#DDE0E9",
						primary: "#1F2E65",
						secondary: "#B7C1D2",
					},
				},
			},
		}),
		scrollbar({}),
		tailwindAnimate,
		plugin(({ addUtilities }) => {
			addUtilities({
				".horizontal-scroll-container": {
					"@apply overflow-x-auto whitespace-nowrap flex items-center": {},
				},
				".horizontal-scroll-item": {
					"@apply inline-block": {},
				},
				".item-drag": {
					"-webkit-user-drag": "none",
				},
				".no-overflow-anchoring": {
					overflowAnchor: "none",
				},
				".text-color-base": {
					"@apply text-lightText dark:text-darkText": {},
				},
			});
		}),
	],
} satisfies Config;

export default config;
