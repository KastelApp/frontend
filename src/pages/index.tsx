import HomeLayout from "@/layouts/HomeLayout.tsx";
import { useIsReady, useTokenStore, useTranslationStore } from "@/wrapper/Stores.ts";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO.tsx";

const IndexPage = () => {
	const { t, setLanguage, fetchLanguages } = useTranslationStore();
	const { token } = useTokenStore();

	const [device, setDevice] = useState<string>("");
	const { setIsReady } = useIsReady();

	useEffect(() => {
		if (typeof window !== "undefined") {
			setDevice(window.navigator.userAgent);
		}

		// @ts-expect-error -- For now, we will keep this here
		globalThis.setLanguage = setLanguage;
		// @ts-expect-error -- For now, we will keep this here
		globalThis.getLanguages = () => {
			const langs = fetchLanguages();

			console.log(
				"pick a lang (use the code i.e en, fr, de then do setLanguage('langCode')\n\n",
				langs.map((lang) => `${lang.code} [${lang.status}] - ${lang.notes.join(", ") || "No Notes"}`).join("\n\n"),
			);
		};
	}, []);

	return (
		<>
			<SEO title={"Home"} />

			<HomeLayout>
				<div className="flex items-center justify-center bg-cover py-36 text-white">
					<div className="text-center">
						<h1 className="text-3xl font-bold">{t("home.title")}</h1>
						<p className="mt-4 text-medium">{t("home.subtitle")}</p>
						<p className="text-medium">{t("home.subtitle2")}</p>
						<div className="mt-8">
							<Button href={token ? "/app" : "/register"} as={Link} size="lg" variant="flat" color="primary" onClick={() => {
								setIsReady(false);
							}}>
								{token ? t("home.navbar.app") : t("home.getStarted")}
							</Button>
							<Button href="/download" as={Link} className="ml-4" size="lg" variant="flat" color="success">
								{t("home.download")}{" "}
								{device.includes("Android")
									? "Android"
									: device.includes("iPhone")
										? "iOS"
										: device.includes("Windows")
											? "Windows"
											: "Unknown"}
							</Button>
						</div>
					</div>
				</div>
			</HomeLayout>
		</>
	);
};

export default IndexPage;
