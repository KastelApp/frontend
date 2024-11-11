import Link from "@/components/Link.tsx";
import { useRouter } from "@/hooks/useRouter.ts";
import HomeLayout from "@/layouts/HomeLayout.tsx";
import { useTranslationStore } from "@/wrapper/Stores.tsx";
import { Button } from "@nextui-org/react";

const FourOhFour = () => {
	const router = useRouter();
	const { t } = useTranslationStore();

	return (
		<>
			<HomeLayout>
				<div className="flex items-center justify-center bg-cover py-32 text-white">
					<div className="text-center">
						<h1 className="text-3xl font-bold">{t("error.forohfor.header")}</h1>
						<p className="mt-4 text-medium">{t("error.forohfor.message")}</p>
						<div className="mt-8">
							<Button href="/" as={Link} size="lg" variant="flat" color="primary">
								{t("error.forohfor.buttons.home")}
							</Button>
							<Button onPress={() => router.back()} className="ml-4" size="lg" variant="flat" color="success">
								{t("error.forohfor.buttons.back")}
							</Button>
						</div>
					</div>
				</div>
			</HomeLayout>
		</>
	);
};

export default FourOhFour;
