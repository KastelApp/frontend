import { NavBarLocation } from "@/types/payloads/ready.ts";
import { useCurrentStore, useGuildSettingsStore, useSettingsStore } from "@/wrapper/Stores.ts";
import {
	Chip,
	Divider,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	useDisclosure,
} from "@nextui-org/react";
import {
	AlignJustify,
	ChevronDown,
	ChevronRight,
	Hash,
	Mail,
	Pencil,
	Settings,
	UserRound,
	UsersRound,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import TopNavBar from "./TopNavBar.tsx";
import { motion } from "framer-motion";
import MemberBar from "./MemberBar.tsx";
import ChangeNickname from "../Modals/ChangeNickname.tsx";
import ConfirmLeave from "../Modals/ConfirmLeave.tsx";
import BaseSettings from "../Modals/BaseSettings.tsx";
import Overview from "../Settings/Guild/OverView.tsx";
import ConfirmDelete from "../Modals/ConfirmDelete.tsx";
import Roles from "../Settings/Guild/Roles.tsx";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
// import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { channelTypes } from "@/utils/Constants.ts";
import ChannelIcon from "../ChannelIcon.tsx";
import GuildIcon from "../GuildIcon.tsx";

const Channel = ({
	startContent,
	text,
	onlyShowOnHover,
	endContent,
	divider,
	shouldHideHover,
	hasUnreadMessages
}: {
	text: string;
	startContent?: React.ReactElement | React.ReactElement[];
	endContent?: React.ReactElement | React.ReactElement[];
	onlyShowOnHover?: boolean;
	divider?: boolean;
	shouldHideHover?: boolean;
	hasUnreadMessages?: boolean;
}) => {
	return (
		<div className="first:mt-2">
			<div
				className={twMerge(
					"flex items-center gap-1 p-1 cursor-pointer group rounded-md w-48 mb-1 text-white transition-all duration-75 ease-in-out",
					!shouldHideHover ? "hover:bg-slate-500" : "hover:text-slate-400",
				)}
			>
				{hasUnreadMessages && <div className="w-1 h-2 bg-white absolute left-1 rounded-r-lg" />}
				{startContent}
				<p className={twMerge("text-sm truncate", hasUnreadMessages ? "font-bold" : "")}>{text}</p>
				{endContent && (
					<div className={twMerge("ml-auto", onlyShowOnHover ? "scale-0 group-hover:scale-100" : "")}>{endContent}</div>
				)}
			</div>
			{divider && <Divider />}
		</div>
	);
};

interface Channel {
	name: string;
	icon?: React.ReactElement | React.ReactElement[];
	description?: string | null;
	channels?: Channel[];
	hasUnread?: boolean;
}

const HandleChannels = ({ channel, onClick }: { channel: Channel, onClick?: () => void; }) => {
	return (
		<div>
			<Channel
				text={channel.name}
				endContent={channel.channels ? <ChevronDown size={20} color="#acaebf" /> : <Settings size={16} onClick={onClick} />}
				startContent={channel.icon}
				shouldHideHover={Boolean(channel.channels)}
				onlyShowOnHover={!channel.channels}
				hasUnreadMessages={channel.hasUnread}
			/>
			{channel.channels && (
				<div className="ml-1">
					{channel.channels?.map((subChannel, index) => (
						<Channel key={index} text={subChannel.name} startContent={subChannel.icon} endContent={<Settings size={16} onClick={onClick} />} onlyShowOnHover hasUnreadMessages={subChannel.hasUnread} />
					))}
				</div>
			)}
		</div>
	);
};

const ChannelNavBar = ({ children }: { children?: React.ReactElement | React.ReactElement[]; }) => {
	const { navBarLocation, isSideBarOpen, setIsSideBarOpen } = useSettingsStore();

	const { guildSettings: rawGuildSettings, setGuildSettings } = useGuildSettingsStore();
	const { isOpen: isNicknameOpen, onOpenChange, onClose } = useDisclosure();
	const {
		isOpen: isConfirmLeaveOpen,
		onOpenChange: onOpenChangeConfirmLeave,
		onClose: onCloseConfirmLeave,
	} = useDisclosure();
	const {
		isOpen: isGuildSettingsOpen,
		onOpenChange: onOpenChangeGuildSettings,
		onClose: onCloseGuildSettings,
	} = useDisclosure();
	const {
		isOpen: isChannelSettingsOpen,
		onOpenChange: onOpenChangeChannelSettings,
		onClose: onCloseChannelSettings,
	} = useDisclosure();

	const { currentGuildId } = useCurrentStore();
	const { getGuild } = useGuildStore();
	const { getChannels } = useChannelStore();
	// const { getCurrentUser } = useUserStore();

	const guildSettings = rawGuildSettings[currentGuildId ?? ""] ?? { memberBarHidden: false };
	const foundGuild = getGuild(currentGuildId ?? "")!;

	const dropdownItems = [
		{
			name: "Invite Friends",
			icon: <UserRound size={20} color="#acaebf" />,
			onClick: () => { },
			end: true, // ? if end is true, then we have a divider
		},
		{
			name: "Guild Settings",
			icon: <Settings size={20} color="#acaebf" />,
			onClick: () => {
				onOpenChangeGuildSettings();
			},
			end: false,
		},
		{
			name: "Create Channel",
			icon: <Hash size={20} color="#acaebf" />,
			onClick: () => { },
			end: false,
		},
		{
			name: "Change Nickname",
			icon: <Pencil size={20} color="#acaebf" />,
			onClick: () => {
				onOpenChange();
			},
			end: true,
		},
		{
			name: "Leave Guild",
			icon: <X size={20} color="#acaebf" />,
			onClick: () => {
				onOpenChangeConfirmLeave();
			},
			end: false,
			color: "danger",
		},
	];

	// ? Built in channels are something like what a few other platforms have, ModMail will be a feature where users can message the mods
	// ? And have it be easier for mods to see the messages, and respond to them instead of using a 3rd party bot PLUS these don't count towards
	// ? The server channel limit, and Channels lets users customize what channels they can see client side
	const builtInChannels = [
		{
			name: "Channels",
			icon: <AlignJustify size={18} color="#acaebf" />,
		},
		{
			name: "ModMail",
			icon: <Mail size={18} color="#acaebf" />,
			rightIcon: (
				<Chip
					classNames={{
						base: "bg-gradient-to-br from-orange-500 to-purple-500 shadow-pink-500/30 mr-2 p-0 h-5 w-4",
						content: "drop-shadow shadow-black text-white",
					}}
					className="text-xs"
				>
					Coming Soon
				</Chip>
			),
		},
	];

	const [normalChannels, setNormalChannels] = useState<Channel[]>([]);

	useEffect(() => {
		const dos = async () => {
			const gotChannels = await getChannels(currentGuildId ?? "");

			const handledChannels: Channel[] = [];

			for (const channel of gotChannels) {
				switch (channel.type) {
					case channelTypes.GuildCategory: {
						const children = gotChannels.filter((c) => c.parentId === channel.id);

						console.log(foundGuild.channelProperties, children);

						handledChannels.push({
							name: channel.name,
							channels: children.map((child) => {
								return {
									name: child.name,
									icon: <ChannelIcon type={child.type} />,
									description: child.description,
									hasUnread: foundGuild.channelProperties.find((p) => p.channelId === child.id)?.lastMessageAckId !== child.lastMessageId,
								};
							}),
						});
					}
				}
			}

			setNormalChannels(handledChannels);
		};

		dos();
	}, [currentGuildId]);

	const [isOpen, setIsOpen] = useState(false);

	const variants = {
		open: { rotate: 90 },
		closed: { rotate: 0 },
	};

	const {
		isOpen: isConfirmDeleteOpen,
		onOpenChange: onOpenChangeConfirmDelete,
		onClose: onCloseConfirmDelete,
	} = useDisclosure();

	return (
		<>
			{/* the modals we use for the buttons */}
			<ChangeNickname isOpen={isNicknameOpen} onOpenChange={onOpenChange} onClose={onClose} />
			<ConfirmLeave isOpen={isConfirmLeaveOpen} onOpenChange={onOpenChangeConfirmLeave} onClose={onCloseConfirmLeave} />
			<BaseSettings
				title="Channel Settings"
				isOpen={isChannelSettingsOpen}
				onOpenChange={onOpenChangeChannelSettings}
				onClose={onCloseChannelSettings}
				initialSection="overview"
				sections={[
					{
						title: null,
						children: [
							{
								title: "Overview",
								id: "overview",
								section: <>Channel ovewview</>,
								disabled: false,
							}
						]
					},
					{
						title: null,
						children: [
							{
								id: "delete",
								title: "Delete",
								danger: true,
							}
						]
					}
				]}
			/>
			<BaseSettings
				title={foundGuild.name}
				isOpen={isGuildSettingsOpen}
				onOpenChange={onOpenChangeGuildSettings}
				onClose={onCloseGuildSettings}
				sections={[
					{
						title: null,
						children: [
							{
								title: "Overview",
								id: "overview",
								section: <Overview />,
								disabled: false,
							},
							{
								title: "Roles",
								id: "roles",
								section: <Roles />,
								disabled: false,
							},
							{
								title: "Emojis",
								id: "emojis",
								section: <div>Emojis</div>,
								disabled: true,
							},
							{
								title: "Vanity URL",
								id: "vanity-url",
								section: <div>Vanity URL</div>,
								disabled: true,
							},
						],
					},
					{
						title: "Community",
						children: [
							{
								title: "Discovery",
								id: "discovery",
								section: <div>Discovery</div>,
								disabled: true,
							},
							{
								title: "Partner & Verification",
								id: "partner",
								section: <div>Partner</div>,
								disabled: true,
							},
						],
					},
					{
						title: "User Management",
						children: [
							{
								title: "Co-Owners",
								id: "co-owners",
								section: <div>Co-Owners</div>,
								disabled: true,
							},
							{
								title: "Members",
								id: "members",
								section: <div>Members</div>,
								disabled: false,
							},
							{
								title: "Bans",
								id: "bans",
								section: <div>Bans</div>,
								disabled: true,
							},
							{
								title: "Invites",
								id: "invites",
								section: <div>Invites</div>,
								disabled: false,
							},
						],
					},
					{
						title: null,
						children: [
							{
								title: "Delete",
								id: "delete",
								disabled: false,
								danger: true,
								onClick: () => {
									onOpenChangeConfirmDelete();
								},
							},
						],
					},
				]}
				initialSection={"overview"}
			/>
			<ConfirmDelete
				isOpen={isConfirmDeleteOpen}
				onOpenChange={onOpenChangeConfirmDelete}
				onClose={onCloseConfirmDelete}
			/>

			<div className="flex flex-row w-full h-screen m-0 overflow-x-auto">
				<div
					className={twMerge(
						"fixed w-52 h-screen m-0  bg-accent overflow-y-auto",
						isSideBarOpen ? (navBarLocation === NavBarLocation.Left ? "ml-16" : "") : "hidden",
					)}
				>
					<div className="flex items-center gap-1 mt-3 select-none border-b-2 border-slate-800">
						<Dropdown onOpenChange={setIsOpen}>
							<DropdownTrigger>
								<div className="flex items-center justify-between w-full mb-2 ml-3 cursor-pointer">
									<div className="flex items-center gap-1">
										<GuildIcon features={foundGuild.features} />
										<p className="text-white text-sm truncate">{foundGuild.name}</p>
									</div>
									<motion.div animate={isOpen ? "open" : "closed"} variants={variants}>
										<ChevronRight size={20} color="#acaebf" />
									</motion.div>
								</div>
							</DropdownTrigger>
							<DropdownMenu
								variant="faded"
								aria-label="Dropdown menu with description"
								onAction={(k) => {
									const found = dropdownItems[k as number];

									if (found) {
										found.onClick();
									}
								}}
							>
								{dropdownItems.map((tab, index) => (
									<DropdownItem
										key={index}
										color={tab.color as "danger" | undefined}
										endContent={tab.icon}
										showDivider={tab.end}
									>
										{tab.name}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
					<div className="flex flex-col items-center justify-start p-1 m-0 overflow-y-auto">
						{builtInChannels.map((channel, index) => (
							<Channel
								key={index}
								text={channel.name}
								startContent={channel.icon}
								endContent={channel.rightIcon}
								divider={index === builtInChannels.length - 1}
							/>
						))}
						{normalChannels.map((channel, index) => (
							<HandleChannels key={index} channel={channel} onClick={() => {
								onOpenChangeChannelSettings();
							}} />
						))}
					</div>
				</div>
				<div className={twMerge("w-full overflow-hidden", isSideBarOpen ? "ml-[17rem]" : "")}>
					<TopNavBar
						startContent={
							<div className="flex items-center gap-1 select-none">
								<Hash size={20} color="#acaebf" />
								<p className="text-gray-300 font-semibold">Test</p>
								<Divider orientation="vertical" className="h-6 ml-2 mr-2 w-[3px]" />
								<p className="text-gray-400 text-sm cursor-pointer truncate w-96">Welcome</p>
							</div>
						}
						isOpen={isSideBarOpen}
						setIsOpen={setIsSideBarOpen}
						icons={[
							{
								icon: <UsersRound size={22} color="#acaebf" />,
								tooltip: guildSettings.memberBarHidden ? "Show Members" : "Hide Members",
								onClick: () => {
									setGuildSettings(currentGuildId ?? "", {
										memberBarHidden: !guildSettings.memberBarHidden,
									});
								},
							},
						]}
					/>
					<div className="flex flex-row overflow-y-auto w-full">
						<div className="flex-grow overflow-y-auto">{children}</div>
						<div className={twMerge(guildSettings.memberBarHidden ? "ml-1" : "ml-[13.2rem]")}>
							<MemberBar />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ChannelNavBar;
