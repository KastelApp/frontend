
import React, { useEffect, useState } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import HomeLayout from "@/layouts/HomeLayout.tsx";
import { Image, Button } from "@nextui-org/react";
import { useIsReady, useTokenStore } from "@/wrapper/Stores.tsx";
import { Routes } from "@/utils/Routes.ts";
import Link from "@/components/Link.tsx";

const FeatureSection = ({ title, description, icon, imageUrl, reverse = false, learnMore, id }: {
	title: string;
	description: string;
	icon: React.ReactNode;
	imageUrl: string;
	reverse?: boolean;
	learnMore?: {
		text?: string;
		link?: string;
	};
	id?: string;
}) => {
	const controls = useAnimation();
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	useEffect(() => {
		if (inView) {
			controls.start("visible");
		}
	}, [controls, inView]);

	const variants = {
		hidden: { opacity: 0, x: reverse ? 100 : -100 },
		visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
	};

	const fixedId = id ?? title.toLowerCase().replaceAll(" ", "-");


	return (
		<div className="odd:bg-darkAccent even:bg-background" id={fixedId}>
			<motion.div
				ref={ref}
				animate={controls}
				initial="hidden"
				variants={variants}
				className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 py-16 container`}
			>
				<div className="w-full md:w-1/2">
					<div className="text-primary mb-4">{icon}</div>
					<Link className="text-3xl font-bold mb-4" href={`#${fixedId}`}>
						<h2>{title}</h2>
					</Link>
					<p className="text-gray-400 mb-6">{description}</p>
					{learnMore && (
						<Button variant="flat" as={Link} href={learnMore.link}>
							{learnMore.text || "Learn more"} <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					)}
				</div>
				<Image
					src={imageUrl}
					alt={title}
					className="rounded-lg shadow-lg max-w-[900px] max-h-96"
				/>
			</motion.div>
		</div>
	);
};

const HomePage = () => {
	const [deviceType, setDeviceType] = useState("Desktop");
	const { token } = useTokenStore();
	const { setIsReady } = useIsReady();

	useEffect(() => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		const ios = /iphone|ipad|ipod/.test(userAgent);
		const android = /android/.test(userAgent);
		const macos = /macintosh/.test(userAgent);
		const windows = /windows/.test(userAgent);

		if (ios) setDeviceType("iOS");
		else if (android) setDeviceType("Android");
		else if (macos) setDeviceType("Mac");
		else if (windows) setDeviceType("Windows");
		else setDeviceType("Desktop");
	}, []);

	return (
		<HomeLayout disableBackgroundImage>
			<div className="text-center py-20">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h1 className="text-5xl md:text-7xl font-bold mb-6">
						Connect, collaborate,
						<br />
						<span className="bg-gradient-to-r from-branding-100 to-primary bg-clip-text text-transparent">
							and create together
						</span>
					</h1>
					<p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
						Come together with Kastel, the chat platform
						Built for communities, gamers, and teams who demand more from their chat platform.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
						<Button size="lg" variant="flat" color="primary" href={token ? Routes.app() : Routes.register()} as={Link} onPress={() => {
							if (token) setIsReady(false);
						}}>
							{token ? "Open App" : "Start chatting for free"}
						</Button>
						<Button size="lg" variant="flat" isDisabled>
							Download for {deviceType} <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</motion.div>
			</div>

			<div className="w-full">
				<FeatureSection
					title="Advanced Permissions"
					description="Kastel offers a robust set of permissions to help you manage your community. Create custom roles, set granular permissions, and manage user access with ease. With Kastel, you're in control."
					icon={<MessageSquare className="h-8 w-8" />}
					imageUrl="https://placehold.co/800x500"
					learnMore={{
						text: "Learn more about permissions",
						link: "#permissions",
					}}
					id="permissions"
				/>
				{/* 
				For now I cba to add more featured sections, but you can add more like this:
				
				<FeatureSection
					title="Another example"
					description="I was too lazy to come up with another example so here you are reading this text."
					icon={<Shield className="h-8 w-8" />}
					imageUrl="https://placehold.co/800x500"
					reverse={true}
				/>

				<FeatureSection
					title="Blah Blah"
					description="Blah Blah Blah, blah blah.. blah blah blah, BLAH!!!! Blah blah..."
					icon={<Zap className="h-8 w-8" />}
					imageUrl="https://placehold.co/800x500"
				/> */}
			</div>

			<div className="text-center py-20">
				<h2 className="text-4xl font-bold mb-8">Ready to elevate your chat experience?</h2>
				<Button size="lg" variant="flat" color="primary" href={token ? Routes.app() : Routes.register()} as={Link} onPress={() => {
					if (token) setIsReady(false);
				}}>
					{token ? "Open App" : "Join Kastel today"}
				</Button>
			</div>
		</HomeLayout>
	);
};

export default HomePage;