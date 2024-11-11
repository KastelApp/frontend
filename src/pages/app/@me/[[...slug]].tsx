import { useRouter } from "@/hooks/useRouter.ts";
import AppLayout from "@/layouts/AppLayout.tsx";

const DmPages = () => {
	const router = useRouter();

	console.log(router.params?.slug);

	return (
		<AppLayout>
			<>Coming Soon™️</>
		</AppLayout>
	);
};

export default DmPages;
