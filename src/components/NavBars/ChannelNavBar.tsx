import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Hash, Mail, Pencil, Settings, Store, UserRound, X } from "lucide-react";
import {
	Divider,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Image,
	Tooltip,
	useDisclosure,
} from "@nextui-org/react";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useHubStore } from "@/wrapper/Stores/HubStore.ts";
import { useEffect, useState } from "react";
import Constants, { channelTypes, snowflake } from "@/data/constants.ts";
import ChannelIcon from "@/components/ChannelIcon.tsx";
import Draggables from "@/components/DraggableComponent.tsx";
import cn from "@/utils/cn.ts";
import BaseSettings from "@/components/Modals/BaseSettings.tsx";
import Overview from "@/components/Settings/Hub/OverView.tsx";
import Roles from "@/components/Settings/Hub/Roles.tsx";
import { Routes } from "@/utils/Routes.ts";
import Link from "@/components/Link.tsx";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export interface ChannelType {
	name: string;
	icon?: React.ReactNode;
	description?: string | null;
	hasUnread?: boolean;
	id: string;
	link?: string;
	type?: number;
	lastMessageId?: string | null;
	currentParentId?: string | null;
}

export const Channel = ({
	startContent,
	text,
	onlyShowOnHover,
	endContent,
	divider,
	shouldHideHover,
	hasUnreadMessages,
	isActive,
	link,
	...props
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
} & Record<string, unknown>) => {
	const LinkMaybe = ({ children }: { children: React.ReactNode }) =>
		link ? (
			<Link href={link} className="w-full item-drag" {...props}>
				{children}
			</Link>
		) : (
			<>{children}</>
		);

	return (
		<div className="group " {...props}>
			<LinkMaybe>
				<>
					<div
						className={cn(
							"mb-1 flex w-full cursor-pointer items-center gap-1 rounded-md p-1 text-white transition-all duration-75 ease-in-out",
							!shouldHideHover ? "hover:bg-slate-500/25" : "hover:text-slate-400",
							isActive ? "!bg-slate-500/50" : "",
						)}
					>
						{hasUnreadMessages && <div className="absolute -left-1 h-2 w-1 rounded-r-lg bg-white" />}
						{startContent}
						<p className={cn("truncate text-sm", hasUnreadMessages ? "font-bold" : "")}>{text}</p>
						{endContent && (
							<div className={cn("ml-auto", onlyShowOnHover ? "scale-0 group-hover:scale-100" : "")}>{endContent}</div>
						)}
					</div>
					{divider && <Divider />}
				</>
			</LinkMaybe>
		</div>
	);
};

const ChannelSidebar = ({ currentChannelId, currentHubId }: { currentHubId: string; currentChannelId: string }) => {
	const { getHub } = useHubStore();
	const { getSortedChannels } = useChannelStore();

	const foundHub = getHub(currentHubId ?? "")!;
	// const foundChannel = getChannel(currentChannelId ?? "")!;

	const [normalChannels, setNormalChannels] = useState<ChannelType[]>([]);

	useEffect(() => {
		const handledChannels: ChannelType[] = [];
		const gotChannels = getSortedChannels(currentHubId ?? "", true);

		for (const channel of gotChannels) {
			switch (channel.type) {
				case channelTypes.HubCategory: {
					handledChannels.push({
						name: channel.name,
						id: channel.id,
						type: channel.type,
					});

					break;
				}

				case channelTypes.HubText:
				case channelTypes.HubMarkdown:
				case channelTypes.HubNewMember:
				case channelTypes.HubNews:
				case channelTypes.HubRules: {
					const foundChannel = foundHub.channelProperties.find((p) => p.channelId === channel.id);

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
						link: Routes.hubChannel(currentHubId, channel.id),
						icon: <ChannelIcon type={channel.type} />,
						description: channel.description,
						hasUnread,
						type: channel.type,
						lastMessageId: channel.lastMessageId,
						currentParentId: channel.parentId,
					});
				}
			}
		}

		setNormalChannels(handledChannels);
	}, [currentHubId]);

	const [draggableOptions, setDraggableOptions] = useState<{
		disabledIndexes?: number[];
		noDropAboveIndexes?: number[];
		noDropBelowIndexes?: number[];
		disableGhostElement?: boolean;
		moveBottomToTop?: boolean;
	}>({});

	const [waffleItems, setWaffleItems] = useState<ChannelType[]>(normalChannels);

	useEffect(() => {
		setWaffleItems(normalChannels);
	}, [normalChannels]);

	const hasBanner = false; // ? for testing banner stuff for now
	const [isOpen, setIsOpen] = useState(false);

	const variants = {
		open: { rotate: 90 },
		closed: { rotate: 0 },
	};

	const {
		isOpen: isHubSettingsOpen,
		onOpenChange: onOpenChangeHubSettings,
		onClose: onCloseHubSettings,
	} = useDisclosure();

	const dropdownItems = [
		{
			name: "Invite Friends",
			icon: <UserRound size={20} color="#acaebf" />,
			onPress: () => {},
			end: true, // ? if end is true, then we have a divider
		},
		{
			name: "Hub Settings",
			icon: <Settings size={20} color="#acaebf" />,
			onPress: () => {
				onOpenChangeHubSettings();
			},
			end: false,
		},
		{
			name: "Create Channel",
			icon: <Hash size={20} color="#acaebf" />,
			onPress: () => {
				// channelonOpenChange();
			},
			end: false,
		},
		{
			name: "Change Nickname",
			icon: <Pencil size={20} color="#acaebf" />,
			onPress: () => {
				// onOpenChange();
			},
			end: true,
		},
		{
			name: "Leave Hub",
			icon: <X size={20} color="#acaebf" />,
			onPress: () => {
				// onOpenChangeConfirmLeave();
			},
			end: false,
			color: "danger",
		},
	];

	return (
		<div className="flex h-full w-60 flex-col bg-darkAccent">
			{/* Settings */}
			<BaseSettings
				title={foundHub.name}
				isOpen={isHubSettingsOpen}
				onOpenChange={onOpenChangeHubSettings}
				onClose={onCloseHubSettings}
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
								onPress: () => {
									// onOpenChangeConfirmDelete();
								},
							},
						],
					},
				]}
				initialSection={"overview"}
			/>

			<div className="relative">
				{hasBanner && (
					<Image
						src="https://placehold.co/2048x2048"
						alt="Server Banner"
						className="z-0 w-screen object-cover mm-h-36"
					/>
				)}
				<Dropdown onOpenChange={setIsOpen} className="bg-darkAccent">
					<DropdownTrigger>
						<div
							className={cn(
								"cursor-pointer p-3",
								hasBanner && "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent",
							)}
						>
							<div className="flex items-center">
								<span className="font-semibold text-white">{foundHub.name || "Unknown Hub"}</span>
								<motion.div animate={isOpen ? "open" : "closed"} className="ml-auto" variants={variants}>
									<ChevronRight className="h-4 w-4 text-gray-400" />
								</motion.div>
							</div>
						</div>
					</DropdownTrigger>
					<DropdownMenu
						variant="faded"
						aria-label="Dropdown menu with description"
						onAction={(k) => {
							const found = dropdownItems[k as number];

							if (found) {
								found.onPress();
							}
						}}
					>
						{dropdownItems.map((tab, index) => (
							<DropdownItem
								key={index}
								color={tab.color as "danger" | undefined}
								endContent={tab.icon}
								showDivider={tab.end}
								className="transition-colors duration-300 ease-in-out hover:bg-charcoal-700"
							>
								{tab.name}
							</DropdownItem>
						))}
					</DropdownMenu>
				</Dropdown>
			</div>
			<div className="p-2">
				<div className="mb-2 flex justify-between">
					{/* cool  */}
					<Tooltip
						content="Modmail Coming Soon!"
						placement="bottom"
						className="bg-gradient-to-r from-branding-500 to-primary"
					>
						<Button variant="ghost" size="icon" className="bg-charcoal-600" disabled>
							<Mail className="h-5 w-5 text-gray-400" />
						</Button>
					</Tooltip>
					<Tooltip content="Modify Channel Layout" placement="bottom">
						<Link href={Routes.hubChannels(currentHubId)}>
							<Button variant="ghost" size="icon" className="bg-charcoal-600">
								<Hash className="h-5 w-5 text-gray-400" />
							</Button>
						</Link>
					</Tooltip>
					<Tooltip content="Members" placement="bottom">
						<Button variant="ghost" size="icon" className="bg-charcoal-600">
							<UserRound className="h-5 w-5 text-gray-400" />
						</Button>
					</Tooltip>
					<Tooltip
						content="Store Coming Soon!"
						placement="bottom"
						className="bg-gradient-to-r from-branding-500 to-primary"
					>
						<Button variant="ghost" size="icon" className="bg-charcoal-600" disabled>
							<Store className="h-5 w-5 text-gray-400" />
						</Button>
					</Tooltip>
				</div>
			</div>
			<Divider className="h-[2px] bg-[#1e1f22]" />
			<ScrollArea className="flex-grow">
				<div className="p-2">
					<Draggables
						items={waffleItems}
						onDrop={(newItems, prevItems, droppedItem) => {
							const updatedItems = [...newItems];

							if (droppedItem.type === channelTypes.HubCategory) {
								const movedCategoryIndex = prevItems.findIndex((item) => item.id === droppedItem.id);

								if (movedCategoryIndex !== -1) {
									const children = [];
									for (let i = movedCategoryIndex + 1; i < prevItems.length; i++) {
										if (prevItems[i].type === channelTypes.HubCategory) {
											break;
										}

										children.push(prevItems[i]);
									}

									const newCategoryIndex = updatedItems.findIndex((item) => item.id === droppedItem.id);

									if (newCategoryIndex !== -1) {
										for (const child of children) {
											const childIndex = updatedItems.findIndex((item) => item.id === child.id);

											if (childIndex !== -1) updatedItems.splice(childIndex, 1);
										}

										updatedItems.splice(newCategoryIndex + 1, 0, ...children);
									}
								}
							}

							setWaffleItems(updatedItems);

							// ? now, we got to do this on the API side. This is pretty simple overall. What we need to do is this:
							// ? we need to redo the updatedItems array and convert it to this format: [parentless, parentless, {parent, children: [child, child, child]}]
							// ? only the ids though nothing else
							const apiReadyItems: (string | { id: string; children: string[] })[] = [];

							for (const item of updatedItems) {
								if (
									apiReadyItems.some((found) =>
										typeof found === "string" ? found === item.id : found.children.includes(item.id),
									)
								) {
									continue;
								}

								if (item.type === channelTypes.HubCategory) {
									const children = [];
									for (let i = updatedItems.indexOf(item) + 1; i < updatedItems.length; i++) {
										if (updatedItems[i].type === channelTypes.HubCategory) {
											break;
										}

										children.push(updatedItems[i].id);
									}

									apiReadyItems.push({ id: item.id, children });

									continue;
								}

								apiReadyItems.push(item.id);
							}

							console.log(
								apiReadyItems.map((item) =>
									typeof item === "string"
										? updatedItems.find((c) => c.id === item)
										: {
												channel: updatedItems.find((c) => c.id === item.id),
												children: item.children.map((c) => updatedItems.find((cc) => cc.id === c)),
											},
								),
							);
						}}
						onDrag={(item, items) => {
							const nonCategoryIndexes = items
								.filter((channel) => channel.type !== Constants.channelTypes.HubCategory)
								.map((category) => items.indexOf(category));

							const allCategories = items.filter((channel) => channel.type === Constants.channelTypes.HubCategory);

							const hubCategoryIndexes = allCategories
								.filter((category) => item.id !== category.id)
								.map((category) => items.indexOf(category));

							const areWeTheLastCategory = allCategories[allCategories.length - 1].id === item.id;
							const categoryUnderUs = allCategories.find((category) => {
								return items.indexOf(category) > items.indexOf(item);
							});

							if (item.type === Constants.channelTypes.HubCategory) {
								setDraggableOptions({
									disabledIndexes: nonCategoryIndexes,
									noDropBelowIndexes: hubCategoryIndexes,
									disableGhostElement: areWeTheLastCategory,
									noDropAboveIndexes: categoryUnderUs ? [items.indexOf(categoryUnderUs)] : [],
								});
							} else {
								setDraggableOptions({
									moveBottomToTop: true,
								});
							}
						}}
						onDragStop={() => {
							setDraggableOptions({});
						}}
						{...draggableOptions}
						render={(channel, _, props) => (
							<Channel
								text={channel.name}
								endContent={
									<>
										{channel.type === channelTypes.HubCategory ? (
											<ChevronDown size={20} color="#acaebf" />
										) : (
											<Settings
												size={16}
												onClick={(e) => {
													e.stopPropagation();
													e.nativeEvent.preventDefault();
												}}
											/>
										)}
									</>
								}
								startContent={channel.icon}
								shouldHideHover={channel.type === channelTypes.HubCategory}
								onlyShowOnHover={channel.type !== channelTypes.HubCategory}
								hasUnreadMessages={channel.hasUnread}
								isActive={channel.id === currentChannelId}
								link={channel.link}
								no-drag={channel.type === channelTypes.HubCategory}
								key={channel.id}
								{...props}
							/>
						)}
					/>
				</div>
			</ScrollArea>
		</div>
	);
};

export default ChannelSidebar;
