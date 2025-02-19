import React, { useEffect, useState } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import HomeLayout from "@/layouts/HomeLayout.tsx";
import { Image, Button } from "@nextui-org/react";
import { useIsReady, useTokenStore } from "@/wrapper/Stores.tsx";
import { Routes } from "@/utils/Routes.ts";
import Link from "@/components/Link.tsx";
import cn from "@/utils/cn.ts";

const FeatureSection = ({
	title,
	description,
	icon,
	imageUrl,
	reverse = false,
	learnMore,
	id,
	titleClassnames,
	buttonClassnames,
	buttonTextClassnames
}: {
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
	titleClassnames?: string;
	buttonClassnames?: string;
	buttonTextClassnames?: string;
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
				className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} container items-center gap-8 py-16`}
			>
				<div className="w-full md:w-1/2">
					<div className="mb-4 text-primary">{icon}</div>
					<Link className={cn("mb-4 text-3xl font-bold", titleClassnames)} href={`#${fixedId}`}>
						{title}
					</Link>
					<p className="mb-6 text-gray-400">{description}</p>
					{learnMore && (
						<Button variant="flat" as={Link} href={learnMore.link} className={buttonClassnames}>
							<span className={cn("flex justify-center items-center", buttonTextClassnames)}>
								{learnMore.text || "Learn more"} <ArrowRight className={"ml-2 h-4 w-4 text-primary"} />
							</span>
						</Button>
					)}
				</div>
				<Image
					src={imageUrl}
					alt={title}
					className="w-full max-w-full md:max-h-96 md:max-w-[900px] rounded-lg shadow-lg object-cover"
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
			<div className="py-20 text-center">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
					<h1 className="mb-6 text-5xl font-bold md:text-7xl text-white">
						Connect, collaborate,
						<br />
						<span className="bg-gradient-to-r from-branding-100 to-primary bg-clip-text text-transparent">
							and create together
						</span>
					</h1>
					<p className="mx-auto mb-8 max-w-2xl text-xl text-gray-400">
						Come together with Kastel, the chat platform Built for communities, gamers, and teams who demand more from
						their chat platform.
					</p>
					<div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
						<Button
							size="lg"
							variant="flat"
							color="primary"
							href={token ? Routes.app() : Routes.register()}
							as={Link}
							onClick={() => {
								if (token) setIsReady(false);
							}}
						>
							{token ? "Open App" : "Start chatting for free"}
						</Button>
						<Button size="lg" variant="flat" isDisabled>
							Download for {deviceType} <ArrowRight className={"ml-2 h-4 w-4"} />
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
					titleClassnames="bg-gradient-to-r from-branding-100 to-primary bg-clip-text text-transparent"
					buttonClassnames="bg-gradient-to-r from-branding-100/20 to-primary/20"
					buttonTextClassnames="bg-gradient-to-l from-branding-100 to-primary bg-clip-text text-transparent"
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

			<div className="py-20 text-center">
				<h2 className="mb-8 text-4xl font-bold text-white">Ready to elevate your chat experience?</h2>
				<Button
					size="lg"
					variant="flat"
					color="primary"
					href={token ? Routes.app() : Routes.register()}
					as={Link}
					onClick={() => {
						if (token) setIsReady(false);
					}}
				>
					{token ? "Open App" : "Join Kastel today"}
				</Button>
			</div>
		</HomeLayout>
	);
};

export default HomePage;
