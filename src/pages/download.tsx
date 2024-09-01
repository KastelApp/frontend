import HomeLayout from "@/layouts/HomeLayout.tsx";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO.tsx";

const IndexPage = () => {
	const [device, setDevice] = useState<string>("");

	useEffect(() => {
		if (typeof window !== "undefined") {
			setDevice(window.navigator.userAgent);
		}
	}, []);

	return (
		<>
			<SEO title={"Download"} />

			<HomeLayout>
				<div className="flex items-center justify-center bg-cover py-32 text-white">
					<div className="text-center">
						<h1 className="text-3xl font-bold">Want to give Kastel a try?</h1>
						<p className="mt-2 text-medium">Go ahead and click the link below to download for your device!</p>
						<div className="mt-4">
							<Button href="/download" as={Link} className="ml-4" size="lg" variant="flat" color="success">
								Download for{" "}
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
