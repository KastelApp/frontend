import { useRouter } from "next/router";

const DmPages = () => {
	const router = useRouter();
	
    console.log(router.query?.slug)

	return (
		<>
		Coming Soon™️
		</>
	);
};

DmPages.shouldHaveLayout = true;

export default DmPages;
