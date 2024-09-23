import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { fontSans, fontMono } from "@/config/fonts";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import "@/styles/colorPalette.css";
import ErrorBoundary from "@/layouts/ErrorBoundary.tsx";
import { useTranslationStore } from "@/wrapper/Stores.tsx";
import SEO from "@/components/SEO.tsx";
import { DefaultSeo } from "next-seo";
import Init from "@/components/Init.tsx";
import { NextPage } from "next";
import { useEffect } from "react";
import { Figtree } from "next/font/google";

const dmSans = Figtree({
	subsets: ["latin"],
	display: "swap",
});

type NextPageWithLayout = NextPage & {
	shouldHaveLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
	const router = useRouter();

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const { _hasHydrated } = useTranslationStore();

	useEffect(() => {
		window.addEventListener("contextmenu", (e) => {
			e.preventDefault();
		});

		return () => {
			window.removeEventListener("contextmenu", (e) => {
				e.preventDefault();
			});
		};
	}, []);

	if (!_hasHydrated) return null;

	const shouldHaveLayout = Component.shouldHaveLayout || false;

	return (
		<>
			<DefaultSeo {...SEO} />
			<ErrorBoundary>
				<NextUIProvider navigate={router.push} className={dmSans.className}>
					<NextThemesProvider attribute="class">
						<Init shouldHaveLayout={shouldHaveLayout}>
							<Component {...pageProps} />
						</Init>
					</NextThemesProvider>
				</NextUIProvider>
			</ErrorBoundary>
		</>
	);
};

export const fonts = {
	sans: fontSans.style.fontFamily,
	mono: fontMono.style.fontFamily,
};

export default App;
