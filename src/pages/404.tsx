import HomeLayout from "@/layouts/HomeLayout.tsx";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";

const FourOhFour = () => {
	const router = useRouter();

	return (
		<HomeLayout>
			<div className="bg-cover text-white py-32 flex items-center justify-center ">
				<div className="text-center">
					<h1 className="text-3xl font-bold">404 - Page Not Found</h1>
					<p className="text-medium mt-4">The page you are looking for does not exist.</p>
					<div className="mt-8">
						<Button href="/" as={Link} size="lg" variant="flat" color="primary">Go Home</Button>
						<Button onClick={() => router.back()} className="ml-4" size="lg" variant="flat" color="success" >Go Back</Button>
					</div>
				</div>
			</div>
		</HomeLayout>
	);
};

export default FourOhFour;