import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import ErrorBoundary from "@/layouts/ErrorBoundary.tsx";
import ErrorHandler from "@/layouts/ErrorHandler.tsx";

const App = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();

	return (
		<ErrorBoundary>
			<ErrorHandler>
				<NextUIProvider navigate={router.push}>
					<NextThemesProvider>
						<Component {...pageProps} />
					</NextThemesProvider>
				</NextUIProvider>
			</ErrorHandler>
		</ErrorBoundary>
	);
};

export const fonts = {
	sans: fontSans.style.fontFamily,
	mono: fontMono.style.fontFamily,
};

export default App;