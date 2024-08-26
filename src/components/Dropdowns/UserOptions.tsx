import { Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react";
import { ArrowRight, LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import CustomStatus from "../Modals/CustomStatus.tsx";
import OverView from "../Settings/User/Overview.tsx";
import BaseSettings from "../Modals/BaseSettings.tsx";
import { Section } from "@/types/settings.ts";
import { useRouter } from "next/router";
import { useTokenStore, useTranslationStore } from "@/wrapper/Stores.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import DifferentTesting from "../Settings/User/DifferentTesting.tsx";

const UserOptions = ({ children, type = "context", orientation = "vertical" }: { children: React.ReactElement | React.ReactElement[]; type?: "normal" | "context", orientation?: "vertical" | "horizontal"; }) => {
	const router = useRouter();
	const { setToken } = useTokenStore();
	const { getCurrentUser, isStaff } = useUserStore();
	const [statusOpen, setStatusOpen] = useState(false);
	const [status, setStatus] = useState<"Online" | "Invisible" | "DND" | "Idle">("Invisible");
	const { t } = useTranslationStore();

	const color =
		status === "Online" ? "success" : status === "Idle" ? "warning" : status === "DND" ? "danger" : "gray-500";

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

	const [sections, setSections] = useState<Section[]>([{
		title: null,
		id: "user",
		children: [
			{
				title: t("settings.user.overview"),
				id: "overview",
				section: <OverView />,
				disabled: false,
			},
		],
	}]);

	useEffect(() => {
		const gotUser = getCurrentUser();

		const developerSections = { // t! If the user does not have developer mode enabled, do not show these
			title: t("settings.developer.title"),
			id: "developer",
			children: [
				{
					title: t("settings.developer.experiments"),
					id: "experiments",
					// t! Users should have access to "public" experiments, but not "private" ones
					// t! private ones are something that are still in the works but may break or may need access for a certian api endpoint
					// t! which we haven't finalized yet (or if we just want a low roll outs)
					section: <div>Experiments</div>,
					disabled: false,
				},
				{
					title: "Different Testing",
					id: "dft",
					section: <DifferentTesting />,
					disabled: false,
				}
			],
		};

		if (isStaff(gotUser?.id ?? "")) {
			setSections((prev) => ([
				...prev,
				developerSections
			]));
		}

		useUserStore.subscribe((state) => {
			const newCurrentUser = state.getCurrentUser();

			if (!state.isStaff(newCurrentUser?.id ?? "")) {
				setSections((prev) => prev.filter((section) => section.id !== "developer"));
			} else if (state.isStaff(newCurrentUser?.id ?? "") && !sections.some((section) => section.id === "developer")) {
				setSections((prev) => ([
					...prev,
					developerSections
				]));
			}
		});
	}, []);

	return (
		<>
			<BaseSettings
				title={t("settings.user.title")}
				isOpen={isSettingsOpen}
				onOpenChange={onSettingsOpenChange}
				onClose={onSettingsClose}
				sections={sections}
				initialSection={"overview"}
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
									className={twMerge("transition-transform duration-300", statusOpen ? "rotate-90" : "")}
								/>
							}
						>
							<p>Status</p>
							<p className={twMerge("text-xs mt-1", `text-${color}`)}>{status}</p>
							<motion.div
								className="grid grid-cols-[repeat(2,minmax(0px,1fr))] items-center mt-2"
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
