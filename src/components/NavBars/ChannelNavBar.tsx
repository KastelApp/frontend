import { NavBarLocation } from "@/types/payloads/ready.ts";
import { useGuildSettingsStore, useSettingsStore } from "@/wrapper/Stores.ts";
import { Chip, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react";
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
import React, { useEffect, useState } from "react";
import cn from "@/utils/cn.ts";
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
import Constants, { channelTypes, snowflake } from "@/utils/Constants.ts";
import ChannelIcon from "../ChannelIcon.tsx";
import GuildIcon from "../GuildIcon.tsx";
import Link from "next/link";
import Draggables from "../DraggableComponent.tsx";
import CreateChannelModal from "@/components/Modals/CreateChannel.tsx";
import { modalStore } from "@/wrapper/Stores/GlobalModalStore.ts";

const Channel = ({
	startContent,
	text,
	onlyShowOnHover,
	endContent,
	divider,
	shouldHideHover,
	hasUnreadMessages,
	isActive,
	link,
}: {
	text: string;
	startContent?: React.ReactNode;
	endContent?: React.ReactNode;
	onlyShowOnHover?: boolean;
	divider?: boolean;
	shouldHideHover?: boolean;
	hasUnreadMessages?: boolean;
	isActive?: boolean;
	link?: string;
}) => {
	const LinkMaybe = ({ children }: { children: React.ReactNode }) =>
		link ? (
			<Link href={link} passHref className="item-drag">
				{children}
			</Link>
		) : (
			<>{children}</>
		);

	return (
		<div className="first:mt-2">
			<LinkMaybe>
				<>
					<div
						className={cn(
							"group mb-1 flex w-48 cursor-pointer items-center gap-1 rounded-md p-1 text-white transition-all duration-75 ease-in-out",
							!shouldHideHover ? "hover:bg-slate-500/25" : "hover:text-slate-400",
							isActive ? "!bg-slate-500/50" : "",
						)}
					>
						{hasUnreadMessages && <div className="absolute left-1 h-2 w-1 rounded-r-lg bg-white" />}
						{startContent}
						<p className={cn("truncate text-sm", hasUnreadMessages ? "font-bold" : "")}>{text}</p>
						{endContent && (
							<div className={cn("ml-auto", onlyShowOnHover ? "scale-0 group-hover:scale-100" : "")}>
								{endContent}
							</div>
						)}
					</div>
					{divider && <Divider />}
				</>
			</LinkMaybe>
		</div>
	);
};

interface Channel {
	name: string;
	icon?: React.ReactNode;
	description?: string | null;
	hasUnread?: boolean;
	id: string;
	link?: string;
	type?: number;
}

const ChannelNavBar = ({
	children,
	isChannelHeaderHidden,
	isMemberBarHidden,
	currentGuildId,
	currentChannelId,
}: {
	children?: React.ReactNode;
	isMemberBarHidden?: boolean;
	isChannelHeaderHidden?: boolean;
	currentGuildId: string;
	currentChannelId?: string;
}) => {
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
	const { isOpen: isChannelOpen, onOpenChange: channelonOpenChange, onClose: channelonClose } = useDisclosure();

	const { getGuild } = useGuildStore();
	const { getSortedChannels, getChannel } = useChannelStore();

	const guildSettings = rawGuildSettings[currentGuildId ?? ""] ?? { memberBarHidden: false };
	const foundGuild = getGuild(currentGuildId ?? "")!;
	const foundChannel = getChannel(currentChannelId ?? "")!;

	const dropdownItems = [
		{
			name: "Invite Friends",
			icon: <UserRound size={20} color="#acaebf" />,
			onClick: () => {},
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
			onClick: () => {
				channelonOpenChange();
			},
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
		const handledChannels: Channel[] = [];
		const gotChannels = getSortedChannels(currentGuildId ?? "", true);

		for (const channel of gotChannels) {
			switch (channel.type) {
				case channelTypes.GuildCategory: {
					handledChannels.push({
						name: channel.name,
						id: channel.id,
						type: channel.type,
						// channels: channel.channels.map((child) => {
						// 	return {
						// 		name: child.name,
						// 		id: child.id,
						// 		link: `/app/guilds/${currentGuildId}/channels/${child.id}`,
						// 		icon: <ChannelIcon type={child.type} />,
						// 		description: child.description,
						// 		hasUnread: foundGuild.channelProperties.find((p) => p.channelId === child.id)?.lastMessageAckId !== child.lastMessageId
						// 	};
						// }),
					});

					break;
				}

				case channelTypes.GuildText:
				case channelTypes.GuildMarkdown:
				case channelTypes.GuildNewMember:
				case channelTypes.GuildNews:
				case channelTypes.GuildRules: {
					const foundChannel = foundGuild.channelProperties.find((p) => p.channelId === channel.id);

					let hasUnread = false;

					if (
						foundChannel?.lastMessageAckId !== channel.lastMessageId &&
						snowflake.timeStamp(foundChannel?.lastMessageAckId ?? "0") <
							snowflake.timeStamp(channel.lastMessageId ?? "0")
					) {
						hasUnread = true;
					}

					handledChannels.push({
						name: channel.name,
						id: channel.id,
						link: `/app/guilds/${currentGuildId}/channels/${channel.id}`,
						icon: <ChannelIcon type={channel.type} />,
						description: channel.description,
						hasUnread,
						type: channel.type,
					});
				}
			}
		}

		setNormalChannels(handledChannels);
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

	const [draggableOptions, setDraggableOptions] = useState<{
		disabledIndexes?: number[];
		noDropAboveIndexes?: number[];
		noDropBelowIndexes?: number[];
	}>({});

	return (
		<>
			{/* the modals we use for the buttons */}
			<ChangeNickname isOpen={isNicknameOpen} onOpenChange={onOpenChange} onClose={onClose} />
			<ConfirmLeave isOpen={isConfirmLeaveOpen} onOpenChange={onOpenChangeConfirmLeave} onClose={onCloseConfirmLeave} />
			<CreateChannelModal isOpen={isChannelOpen} onOpenChange={channelonOpenChange} onClose={channelonClose} />
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
								section: <>Channel Overview</>,
								disabled: false,
							},
						],
					},
					{
						title: null,
						children: [
							{
								id: "delete",
								title: "Delete",
								danger: true,
							},
						],
					},
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

			<div className="m-0 flex h-screen w-full flex-row overflow-x-auto">
				<div
					className={cn(
						"fixed m-0 h-screen w-52 overflow-y-auto bg-lightAccent dark:bg-darkAccent",
						isSideBarOpen ? (navBarLocation === NavBarLocation.Left ? "ml-16" : "") : "hidden",
					)}
				>
					<div className="mt-3 flex select-none items-center gap-1 border-b-2 border-slate-800">
						<Dropdown onOpenChange={setIsOpen}>
							<DropdownTrigger>
								<div className="mb-2 ml-3 flex w-full cursor-pointer items-center justify-between">
									<div className="flex items-center gap-1">
										<GuildIcon features={foundGuild.features} />
										<p className="truncate text-sm text-white">{foundGuild.name}</p>
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
					<div className="m-0 flex flex-col items-center justify-start overflow-y-auto p-1">
						{builtInChannels.map((channel, index) => (
							<Channel
								key={index}
								text={channel.name}
								startContent={channel.icon}
								endContent={channel.rightIcon}
								divider={index === builtInChannels.length - 1}
							/>
						))}
						<Draggables
							items={normalChannels}
							onDrop={() => {
								console.log("drop");
							}}
							onDrag={(item, items) => {
								const nonCategoryIndexes = items
									.map((item, index) => (item.type !== Constants.channelTypes.GuildCategory ? index : null))
									.filter((type) => type !== null);

								if (item.type === Constants.channelTypes.GuildCategory) {
									setDraggableOptions({
										disabledIndexes: nonCategoryIndexes,
									});
								}
							}}
							onDragStop={() => {
								setDraggableOptions({});
							}}
							{...draggableOptions}
							render={(channel) => (
								<Channel
									text={channel.name}
									endContent={
										channel.type === channelTypes.GuildCategory ? (
											<ChevronDown size={20} color="#acaebf" />
										) : (
											<Settings
												size={16}
												onClick={(e) => {
													e.stopPropagation();
													e.nativeEvent.preventDefault();

													onOpenChangeChannelSettings();
												}}
											/>
										)
									}
									startContent={channel.icon}
									shouldHideHover={channel.type === channelTypes.GuildCategory}
									onlyShowOnHover={channel.type !== channelTypes.GuildCategory}
									hasUnreadMessages={channel.hasUnread}
									isActive={channel.id === currentChannelId}
									link={channel.link}
									no-drag={channel.type === channelTypes.GuildCategory}
									key={channel.id}
								/>
							)}
						/>
					</div>
				</div>
				<div
					className={cn(
						"w-full overflow-x-hidden",
						navBarLocation === NavBarLocation.Left ? (isSideBarOpen ? "ml-[17rem]" : "") : "ml-[13rem]",
					)}
				>
					{!isChannelHeaderHidden && (
						<TopNavBar
							startContent={
								<div className="flex select-none items-center gap-1">
									<Hash size={20} color="#acaebf" />
									<p className="font-semibold text-gray-300">{foundChannel?.name}</p>
									{foundChannel?.description && (
										<>
											<Divider orientation="vertical" className="ml-2 mr-2 h-6 w-[3px]" />
											<p
												className="w-96 cursor-pointer truncate text-sm text-gray-400"
												onClick={() => {
													modalStore.getState().createModal({
														id: `channel-topic-${foundChannel.id}`,
														title: `${foundChannel.name}'s Topic`,
														closable: true,
														props: {
															modalSize: "md",
														},
														body: <div className="flex flex-col">{foundChannel.description}</div>,
													});
												}}
											>
												{foundChannel.description}
											</p>
										</>
									)}
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
											lastChannelId: currentChannelId!,
										});
									},
								},
							]}
						/>
					)}
					<div className="flex max-h-[calc(100vh-4rem)] w-full flex-row overflow-y-auto">
						<div className="flex-grow overflow-y-auto">{children}</div>
						{!isMemberBarHidden && (
							<div className={cn(guildSettings.memberBarHidden ? "ml-1" : "ml-[13.2rem]")}>
								<MemberBar />
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ChannelNavBar;
