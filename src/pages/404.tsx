import HomeLayout from "@/layouts/HomeLayout.tsx";
import { useTranslationStore } from "@/wrapper/Stores.ts";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";

const FourOhFour = () => {
	const router = useRouter();

	const { t } = useTranslationStore();

	return (
		<HomeLayout>
			<div className="bg-cover text-white py-32 flex items-center justify-center ">
				<div className="text-center">
					<h1 className="text-3xl font-bold">{t("error.forohfor.header")}</h1>
					<p className="text-medium mt-4">{t("error.forohfor.message")}</p>
					<div className="mt-8">
						<Button href="/" as={Link} size="lg" variant="flat" color="primary">{t("error.forohfor.buttons.home")}</Button>
						<Button onClick={() => router.back()} className="ml-4" size="lg" variant="flat" color="success" >{t("error.forohfor.buttons.back")}</Button>
					</div>
				</div>
			</div>
		</HomeLayout>
	);
};

export default FourOhFour;