import { useRouter } from "@/hooks/useRouter.ts";
import ErrorBoundary from "@/layouts/ErrorBoundary.tsx";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextUIProvider } from "@nextui-org/react";
import { useRoutes } from "react-router-dom";
import routes from "~react-pages";
import { useTranslationStore } from "@/wrapper/Stores.tsx";
import Init from "@/components/Init.tsx";

const App = () => {
	const router = useRouter();

	const { _hasHydrated: hasHydrated } = useTranslationStore();

	const usedRoutes = useRoutes(routes);

	if (!hasHydrated) return null;

	return (
		<ErrorBoundary>
			<NextUIProvider navigate={router.push}>
				<NextThemesProvider attribute="class">
					<Init>
						{usedRoutes}
					</Init>
				</NextThemesProvider>
			</NextUIProvider>
		</ErrorBoundary>
	);
};

export default App;
