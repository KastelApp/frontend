import { NavBarLocation } from "@/types/payloads/ready.ts";
import { useSelectedTab, useSettingsStore } from "@/wrapper/Stores.ts";
import { Avatar, Badge } from "@nextui-org/react";
import { Home, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import cn from "@/utils/cn.ts";
import HomeContent from "./DmContent/Home.tsx";
import Friends from "./DmContent/Friends.tsx";
import TopNavBar from "./TopNavBar.tsx";
import { useRouter } from "next/router";
import Link from "next/link";

const DmNavBarItem = ({
	isActive,
	name,
	icon,
	onClick,
	endContent,
	isDisabled,
	underName,
	className,
	textSize = "md",
	href,
}: {
	icon?: React.ReactElement | React.ReactElement[];
	name: string;
	isActive?: boolean;
	onClick?: () => void;
	endContent?: React.ReactElement | React.ReactElement[];
	isDisabled?: boolean;
	underName?: string | null;
	textSize?: "sm" | "md" | "lg";
	className?: string;
	href?: string;
}) => {
	const LinkMaybe = ({ children }: { children: React.ReactNode }) =>
		href ? (
			<Link href={href} passHref>
				{children}
			</Link>
		) : (
			<>{children}</>
		);

	return (
		<div
			className={cn(
				"group ml-2 mt-2 flex h-10 w-[12rem] transform cursor-pointer select-none items-center justify-start rounded-lg transition-all duration-300 ease-in-out",
				isActive ? "bg-slate-700" : "hover:bg-slate-800",
				isDisabled ? "cursor-not-allowed" : "",
			)}
			onClick={!isDisabled ? onClick : undefined}
		>
			<LinkMaybe>
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center">
						{icon}
						<div className={cn("ml-2 flex flex-col", className)}>
							<p
								className={cn(
									"truncate text-white",
									isDisabled ? "text-gray-500" : "",
									textSize ? `text-${textSize}` : "",
								)}
							>
								{name}
							</p>
							{underName && <p className="truncate text-xs text-gray-500">{underName}</p>}
						</div>
					</div>
					{endContent}
				</div>
			</LinkMaybe>
		</div>
	);
};

const DmNavBar = ({
	children,
	title,
	topNavBarEndContent,
}: {
	children?: React.ReactNode;
	title?: string | null | React.ReactElement;
	topNavBarEndContent?: React.ReactElement;
}) => {
	const { navBarLocation, isSideBarOpen, setIsSideBarOpen } = useSettingsStore();
	const { selectedTab, setSelectedTab } = useSelectedTab();

	const router = useRouter();

	const tabs = [
		{
			name: "Home",
			id: "home",
			disabled: true,
			icon: <Home color="#acaebf" size={20} className="ml-2" />,
		},
		{
			name: "Friends",
			id: "friends",
			disabled: false,
			icon: <UserRound color="#acaebf" size={20} className="ml-2" />,
		},
	];

	const dms = [];

	const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
	const [, , channelId] = router.query?.slug ?? ([] as string[]);

	useEffect(() => {
		if (!router.isReady) return;

		setSelectedChannel(channelId ?? null);

		if (!channelId && !selectedTab) {
			setSelectedTab(tabs[0].id);
		}
	}, [router]);

	return (
		<div className="m-0 flex h-screen w-full flex-row overflow-hidden">
			<div
				className={cn(
					"fixed m-0 h-screen w-52 overflow-hidden bg-lightAccent dark:bg-darkAccent",
					isSideBarOpen ? (navBarLocation === NavBarLocation.Left ? "ml-16" : "") : "hidden",
				)}
			>
				<div className="flex w-full flex-col">
					{tabs.map((tab, index) => (
						<DmNavBarItem
							key={index}
							name={tab.name}
							isActive={selectedTab === tab.id}
							onClick={() => {
								setSelectedTab(tab.id);

								window.history.replaceState(
									{
										...window.history.state,
										as: "/app",
										url: "/app",
									},
									"",
									"/app",
								);

								setSelectedChannel(null);
							}}
							icon={tab.icon}
							isDisabled={tab.disabled}
							textSize="sm"
						/>
					))}
				</div>
				<div className="flex flex-col">
					<p className="ml-2 mt-2 text-xs text-white">Direct Messages</p>
					{dms.length === 0 && (
						<p className="ml-2 mt-4 text-sm text-gray-500">It's pretty lonely here...why not DM someone?</p>
					)}
					{dms.map((dm, index) => (
						<DmNavBarItem
							key={index}
							name={dm.username}
							underName={dm.customStatus}
							textSize="sm"
							icon={
								<>
									<Badge
										content={""}
										placement="bottom-right"
										color={
											dm.status === "Online"
												? "success"
												: dm.status === "Idle"
													? "warning"
													: dm.status === "DND"
														? "danger"
														: "default"
										}
										className="mb-1"
									>
										<Avatar
											src={dm.avatar ?? undefined}
											size="sm"
											name={dm.username}
											className="ml-1"
											imgProps={{ className: "transition-none" }}
										/>
									</Badge>
								</>
							}
							endContent={
								<X
									color="#c7c7c7"
									size={20}
									className="mr-2 scale-0 transition-transform duration-300 ease-in-out group-hover:scale-100"
								/>
							}
							className="w-28 truncate"
							href={`/app/@me/messages/${dm.username}`}
							isActive={selectedChannel === dm.username}
							onClick={() => {
								setSelectedTab(null);
							}}
						/>
					))}
				</div>
			</div>
			<div
				className={cn(
					"w-full",
					navBarLocation === NavBarLocation.Left ? (isSideBarOpen ? "ml-[17rem]" : "") : "ml-[13rem]",
				)}
			>
				<TopNavBar
					startContent={
						<div className="font-semibold text-gray-300">
							{selectedTab === null && title ? title : tabs.find((tab) => tab.id === selectedTab)?.name}
						</div>
					}
					isOpen={isSideBarOpen}
					setIsOpen={setIsSideBarOpen}
					endContent={topNavBarEndContent}
				/>
				<div className="ml-2">
					{selectedTab === null && children ? children : selectedTab === "friends" ? <Friends /> : <HomeContent />}
				</div>
			</div>
		</div>
	);
};

export default DmNavBar;
