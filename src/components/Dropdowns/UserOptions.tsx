import { Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react";
import { ArrowRight, LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import cn from "@/utils/cn.ts";
import { motion } from "framer-motion";
import CustomStatus from "../Modals/CustomStatus.tsx";
import OverView from "../Settings/User/Overview.tsx";
import BaseSettings from "../Modals/BaseSettings.tsx";
import { Section } from "@/types/settings.ts";
import { useRouter } from "next/router";
import { useTokenStore, useTranslationStore } from "@/wrapper/Stores.tsx";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import DifferentTesting from "../Settings/User/DifferentTesting.tsx";
import getClientVersion from "@/utils/getClientVersion.ts";
import Appearance from "@/components/Settings/User/Appearance.tsx";
import Language from "@/components/Settings/User/Language.tsx";

const UserOptions = ({
	children,
	type = "context",
	orientation = "vertical",
}: {
	children: React.ReactElement | React.ReactElement[];
	type?: "normal" | "context";
	orientation?: "vertical" | "horizontal";
}) => {
	const router = useRouter();
	const { setToken } = useTokenStore();
	const { getCurrentUser, isStaff } = useUserStore();
	const [statusOpen, setStatusOpen] = useState(false);
	const [status, setStatus] = useState<"Online" | "Invisible" | "DND" | "Idle">("Invisible");
	const { t } = useTranslationStore();

	// ? Custom Status Modal
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	// ? Settings Modal
	const { isOpen: isSettingsOpen, onOpenChange: onSettingsOpenChange, onClose: onSettingsClose } = useDisclosure();

	const [dropdownOpen, setDropdownOpen] = useState(false);

	const handleAction = (action: string | number) => {
		switch (action) {
			case "changeStatus": {
				setStatusOpen(!statusOpen);

				break;
			}

			case "customStatus": {
				onOpenChange();
				setDropdownOpen(false);

				break;
			}

			case "settings": {
				onSettingsOpenChange();
				setDropdownOpen(false);

				break;
			}

			case "logout": {
				setToken(null);

				router.push("/login");

				// todo: handle better cleanup

				break;
			}
		}
	};

	const handleStatus = (status: "Online" | "Idle" | "DND" | "Invisible") => {
		setStatus(status);
		setTimeout(() => setStatusOpen(true), 25);

		// todo: handle other logic
	};

	const [sections, setSections] = useState<Section[]>([
		{
			title: null,
			id: "user",
			children: [
				{
					title: t("settings.user.overview"),
					id: "overview",
					section: <OverView />,
					disabled: false,
				},
				{
					title: "Sessions",
					id: "sessions",
					disabled: true,
					section: <div>Sessions</div>,
					endContent: <Chip color="primary" size="sm" variant="bordered" className="mr-2" radius="sm">Coming Soon</Chip>,
				},
				{
					title: "Account Status", // ? i.e if they got any warnings or bans etc
					id: "accountStatus",
					disabled: true,
					section: <div>Account Status</div>,
					endContent: <Chip color="primary" size="sm" variant="bordered" className="mr-2" radius="sm">Coming Soon</Chip>,
				},
				{
					title: "Privacy & Safety",
					id: "privacySafety",
					disabled: true,
					section: <div>Privacy & Safety</div>,
					endContent: <Chip color="primary" size="sm" variant="bordered" className="mr-2" radius="sm">Coming Soon</Chip>,
				},

			],
		},
		{
			title: "Billing",
			id: "billing",
			children: [
				{
					title: "Subscriptions",
					id: "subscriptions",
					section: <div>subscriptions</div>,
					disabled: true,
					endContent: <Chip color="primary" size="sm" variant="bordered" className="mr-2" radius="sm">Coming Soon</Chip>,
				},
				{
					title: "Gifts",
					id: "gifts",
					section: <div>gifts</div>,
					disabled: true,
					endContent: <Chip color="primary" size="sm" variant="bordered" className="mr-2" radius="sm">Coming Soon</Chip>,
				},
				{
					title: "Payment",
					id: "payment",
					section: <div>payment</div>,
					disabled: true,
					endContent: <Chip color="primary" size="sm" variant="bordered" className="mr-2" radius="sm">Coming Soon</Chip>,
				}
			]
		},
		{
			title: "General",
			id: "general",
			children: [
				{
					title: "Appearance",
					id: "appearance",
					section: <Appearance />,
					disabled: false
				},
				{
					title: "Language",
					id: "language",
					section: <Language />,
					disabled: false
				},
				{
					title: "Notifications",
					id: "notifications",
					section: <div>Notifications</div>,
					disabled: true,
					endContent: <Chip color="primary" size="sm" variant="bordered" className="mr-2" radius="sm">Coming Soon</Chip>,
				}
			]
		},
		{
			title: "Advanced",
			id: "advanced",
			children: [
				{
					title: "Public Experiments",
					id: "publicExperiments",
					section: <div>Public Experiments</div>,
					disabled: true,
					endContent: <Chip color="primary" size="sm" variant="bordered" className="mr-2" radius="sm">Coming Soon</Chip>,
				}
			]
		}
	]);

	useEffect(() => {
		const gotUser = getCurrentUser();

		const developerSections = {
			// t! If the user does not have developer mode enabled, do not show these
			title: t("settings.developer.title"),
			id: "developer",
			children: [
				{
					title: t("settings.developer.experiments"),
					id: "experiments",
					section: <div>Experiments</div>,
					disabled: false,
				},
				{
					title: "Different Testing",
					id: "dft",
					section: <DifferentTesting />,
					disabled: false,
				},
			],
		};

		if (isStaff(gotUser?.id ?? "")) {
			setSections((prev) => [...prev.filter((section) => section.id !== "developer"), developerSections]);
		}

		useUserStore.subscribe((state) => {
			const newCurrentUser = state.getCurrentUser();

			if (!state.isStaff(newCurrentUser?.id ?? "")) {
				setSections((prev) => prev.filter((section) => section.id !== "developer"));
			} else if (state.isStaff(newCurrentUser?.id ?? "")) {
				setSections((prev) => [...prev.filter((section) => section.id !== "developer"), developerSections]);
			}
		});
	}, []);

	const { channel, version, hash } = getClientVersion();

	return (
		<>
			<BaseSettings
				title={t("settings.user.title")}
				isOpen={isSettingsOpen}
				onOpenChange={onSettingsOpenChange}
				onClose={onSettingsClose}
				sections={sections}
				initialSection={"overview"}
				metadata={
					<div className="flex pl-3">
						<p className="text-sm text-gray-400">
							{channel} {version} ({hash})
						</p>
					</div>
				}
			/>
			<div
				// ? yeah yeah, it add's useless code but I do not care
				onContextMenu={(e) => {
					if (type !== "context") return;

					e.preventDefault();

					setDropdownOpen(!dropdownOpen);

					if (!dropdownOpen) {
						setStatusOpen(false);
					}
				}}
			>
				<CustomStatus isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
				<Dropdown
					placement={orientation === "vertical" ? "right" : "top"}
					closeOnSelect={false}
					onOpenChange={(isOpen) => {
						if (type === "normal") {
							setDropdownOpen(isOpen);
						}

						if (!isOpen) {
							setDropdownOpen(false);
							setStatusOpen(false);
						}
					}}
					isOpen={dropdownOpen}
				>
					<DropdownTrigger>
						<button className="outline-none">{children}</button>
					</DropdownTrigger>
					<DropdownMenu aria-label="Static Actions" onAction={handleAction}>
						<DropdownItem
							closeOnSelect={false}
							key="changeStatus"
							variant="flat"
							endContent={
								<ArrowRight
									size={20}
									className={cn("transition-transform duration-300", statusOpen ? "rotate-90" : "")}
								/>
							}
						>
							<p>Status</p>
							<p className={cn("mt-1 text-xs", status === "Online" ? "text-success" : status === "Idle" ? "text-warning" : status === "DND" ? "text-danger" : "text-gray-500")}>{status}</p>
							<motion.div
								className="mt-2 grid grid-cols-[repeat(2,minmax(0px,1fr))] items-center"
								initial="collapsed"
								animate={statusOpen ? "expanded" : "collapsed"}
								variants={{
									collapsed: { height: 0, opacity: 0 },
									expanded: { height: "auto", opacity: 1 },
								}}
								transition={{ duration: 0.3, delay: 0.05 }}
							>
								<Chip
									onClick={() => handleStatus("Online")}
									variant="flat"
									className="mb-2 min-w-[60px]"
									radius="sm"
									size="sm"
									color="success"
								>
									{t("statusTypes.offline")}
								</Chip>
								<Chip
									onClick={() => handleStatus("Idle")}
									variant="flat"
									className="right-2 mb-2 min-w-[60px]"
									radius="sm"
									size="sm"
									color="warning"
								>
									{t("statusTypes.idle")}
								</Chip>
								<Chip
									onClick={() => handleStatus("DND")}
									variant="flat"
									className="mb-2 min-w-[60px]"
									radius="sm"
									size="sm"
									color="danger"
								>
									{t("statusTypes.dnd")}
								</Chip>
								<Chip
									onClick={() => handleStatus("Invisible")}
									variant="flat"
									className="right-2 mb-2 min-w-[60px]"
									radius="sm"
									size="sm"
									color="default"
								>
									{t("statusTypes.invisible")}
								</Chip>
							</motion.div>
						</DropdownItem>

						<DropdownItem closeOnSelect={true} key="customStatus" variant="flat">
							<p>{t("customStatus")}</p>
							<p className="text-xs text-gray-500">My Custom Status</p>
						</DropdownItem>
						<DropdownItem key="settings" variant="flat" endContent={<Settings size={20} />}>
							{t("settings.settings")}
						</DropdownItem>
						<DropdownItem
							key="logout"
							variant="flat"
							className="text-danger"
							color="danger"
							endContent={<LogOut size={20} />}
						>
							{t("logout")}
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
		</>
	);
};

export default UserOptions;
