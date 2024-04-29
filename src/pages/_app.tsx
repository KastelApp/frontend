import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import ErrorBoundary from "@/layouts/ErrorBoundary.tsx";

const App = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();

	return (
		<NextUIProvider navigate={router.push}>
			<NextThemesProvider>
				<ErrorBoundary>
					<Component {...pageProps} />
				</ErrorBoundary>
			</NextThemesProvider>
		</NextUIProvider>
	);
};

export const fonts = {
	sans: fontSans.style.fontFamily,
	mono: fontMono.style.fontFamily,
};

export default App;