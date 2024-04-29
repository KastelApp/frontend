import HomeLayout from "@/layouts/HomeLayout.tsx";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const IndexPage = () => {

	const [device, setDevice] = useState<string>("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			setDevice(window.navigator.userAgent);
		}
	}, []);

	return (
		<HomeLayout>
			<div className="bg-cover text-white py-32 flex items-center justify-center ">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Ditch those platforms who just don't care!</h1>
					<p className="text-medium mt-4">Why settle for less when you can have a platform that cares about you? Join Kastel, the platform that cares about you!</p>
					<p className="text-medium">Kastel is free, secure, and works on your browser, desktop and mobile devices.</p>
					<div className="mt-8">
						<Button href="/register" as={Link} size="lg" variant="flat" color="primary">Get Started</Button>
						<Button href="/download" as={Link} className="ml-4" size="lg" variant="flat" color="success" >Download for {device.includes("Android") ? "Android" : device.includes("iPhone") ? "iOS" : device.includes("Windows") ? "Windows" : "Unknown"}</Button>
					</div>
				</div>
			</div>
		</HomeLayout>
	);
};

export default IndexPage;