import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import pages from "vite-plugin-pages";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		pages({
			dirs: ["src/pages"],
			routeStyle: "next",
		}),
	],
	server: {
		port: 5000,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
