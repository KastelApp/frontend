// ? The left navbar is inspired by discord due to a ton of users wanting it since they are familiar with it.
// ? Though the bottom bar is the one we will care about the most, the left navbar is still a good option for those who want it.
import { memo, useCallback } from "react";
import { Compass, Plus } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Avatar, Badge, Tooltip, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import Divider from "../Divider.tsx";
import UserOptions from "../Dropdowns/UserOptions.tsx";
import GuildModal from "../Modals/CreateGuild.tsx";
import { useSettingsStore } from "@/wrapper/Stores.ts";
import { BaseContextMenuProps } from "../Dropdowns/BaseContextMenu.tsx";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useRouter } from "next/router";
import Draggables from "../DraggableComponent.tsx";

const Modal = memo(() => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	return (
		<>
			<GuildModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
			<LeftNavBarIcon
				onClick={() => {
					onOpenChange();
				}}
				icon={<Plus className="mt-1.5" color="#acaebf" absoluteStrokeWidth />}
				description="Add Guild"
			/>
		</>
	);
});

const LeftNavbar = () => {
	const { isSideBarOpen } = useSettingsStore();
	const { guilds } = useGuildStore();
	const { getChannelsWithValidPermissions, getTopChannel } = useChannelStore();
	const router = useRouter();

	const { guildId } = router.query as { guildId: string; };

	const mappedGuilds = useCallback(() => {
		return <Draggables items={guilds} onDrop={console.log} render={(item, index) => {
			let hasUnread = false;

			const gotChannels = getChannelsWithValidPermissions(item.id);

			for (const channel of gotChannels) {
				if (item.channelProperties.find((channelProperty) => channelProperty.channelId === channel.id)?.lastMessageAckId !== channel.lastMessageId) {
					hasUnread = true;

					break;
				}
			}

			const topChannel = getTopChannel(item.id);

			return (
				<LeftNavBarIcon
					href={`/app/guilds/${item.id}${topChannel ? `/channels/${topChannel.id}` : ""}`}
					badgePosition="bottom-right"
					badgeColor="danger"
					// badgeContent={item.mentionCount === "0" ? undefined : item.mentionCount}
					key={index}
					icon={
						<Avatar
							name={item.name}
							src={item.icon ?? undefined}
							className="mt-1.5 w-10 h-10 rounded-3xl transition-all group-hover:rounded-xl duration-300 ease-in-out transform"
							imgProps={{ className: "transition-none" }}
						/>
					}
					description={item.name}
					contextMenuItemsProps={{
						values: [
							{
								label: "Test",
							},
						],
						placement: "right",
					}}
					hasUnReadMessages={hasUnread}
					isActive={item.id === guildId}
				/>
			);
		}} />;
	}, [guilds, guildId]);

	return (
		<>
			<div className={twMerge("block", isSideBarOpen ? "" : "hidden")}>
				<div className="fixed left-0 top-0 h-full w-16 flex flex-col shadow-lg z-10 overflow-y-auto overflow-x-hidden scrollbar-hide">
					<LeftNavBarIcon
						icon={
							<div className="min-w-9 min-h-9 max-h-9 max-w-9">
								<Avatar
									src="https://development.kastelapp.com/icon-1.png"
									className="min-w-9 min-h-9 max-h-9 max-w-9 hover:scale-95 transition-all duration-300 ease-in-out transform"
									imgProps={{ className: "transition-none" }}
								/>
							</div>
						}
						isBackgroundDisabled
						badgeContent="9+"
						badgePosition="bottom-right"
						badgeColor="danger"
						InContent={UserOptions}
						href="/app"
						description="Right click to open context menu"
						delay={1000}
					/>
					<Divider size={"[2px]"} />
					{mappedGuilds()}
					<Modal />
					<LeftNavBarIcon
						icon={<Compass className="mt-1.5" color="#acaebf" absoluteStrokeWidth />}
						description="Discover a guild"
						isDisabled
					/>
				</div>
			</div>
		</>
	);
};

const LeftNavBarIcon = memo(({
	icon,
	description,
	isDisabled,
	size = 10,
	isBackgroundDisabled,
	badgeColor,
	badgeContent,
	badgePosition,
	href,
	InContent,
	onClick,
	delay,
	hasUnReadMessages,
	isActive,
	orientation = "vertical",
	// contextMenuItemsProps
}: {
	icon: React.ReactElement | React.ReactElement[];
	description?: string;
	isDisabled?: boolean;
	size?: number;
	isBackgroundDisabled?: boolean;
	badgeContent?: string;
	badgeColor?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
	badgePosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
	href?: string;
	InContent?: React.FC<{ children: React.ReactElement | React.ReactElement[]; }>;
	onClick?: () => void;
	delay?: number;
	contextMenuItemsProps?: BaseContextMenuProps;
	hasUnReadMessages?: boolean;
	isActive?: boolean;
	/**
	  * Orientation of the draggables i.e vertical or horizontal
	  */
	orientation?: "vertical" | "horizontal";
}) => {
	const width = `w-${size}`;
	const height = `h-${size}`;

	const LinkWrapper = ({
		children,
		href,
	}: {
		href?: string;
		children: React.ReactElement | React.ReactElement[];
	}): React.ReactElement =>
		href ? (
			<Link href={href} passHref className="item-drag">
				{children}
			</Link>
		) : (
			(children as React.ReactElement)
		);

	const InContentWrapper = ({
		children,
	}: {
		children: React.ReactElement | React.ReactElement[];
	}): React.ReactElement => (InContent ? <InContent>{children}</InContent> : (children as React.ReactElement));

	const TooltipOrNot = ({ children }: { children: React.ReactElement | React.ReactElement[]; }): React.ReactElement =>
		description ? (
			<Tooltip content={description} showArrow className="select-none" placement={orientation === "vertical" ? "right" : "top"} delay={delay}>
				{children}
			</Tooltip>
		) : (
			(children as React.ReactElement)
		);

	// const RightClickMenuOrNot = ({ children }: {
	//     children: React.ReactElement | React.ReactElement[];
	// }): React.ReactElement => contextMenuItemsProps ? <BaseContextMenu {...contextMenuItemsProps}>{children}</BaseContextMenu> : children as React.ReactElement;

	const RightClickMenuOrNot = ({
		children,
	}: {
		children: React.ReactElement | React.ReactElement[];
	}): React.ReactElement => children as React.ReactElement;

	return (
		<TooltipOrNot>
			<div
				className={twMerge(
					`select-none flex justify-center items-center mt-2
            mb-2
            mx-auto
            rounded-3xl
            transition-all
            duration-300
            ease-in-out
            transform
            group
            `,
					isDisabled
						? `cursor-not-allowed ${!isBackgroundDisabled ? "bg-gray-800 hover:bg-gray-700" : ""}`
						: `cursor-pointer hover:rounded-xl ${!isBackgroundDisabled ? "bg-gray-600 hover:bg-gray-700" : ""}`,
					width,
					height,
				)}
			>

				<div className={
					orientation === "vertical" ? twMerge(
						"w-1 h-0 bg-white absolute -left-2 rounded-r-lg z-10 group-hover:h-4",
						hasUnReadMessages ? "h-2" : "",
						isActive ? "!h-6" : "",
						"transition-all ease-in-out duration-300"
					) : twMerge(
						"w-0 h-1 bg-white absolute -bottom-2 rounded-b-lg z-10 group-hover:w-4",
						hasUnReadMessages ? "w-2" : "",
						isActive ? "!w-6" : "",
						"transition-all ease-in-out duration-300"
					)
				} />
				<RightClickMenuOrNot>
					<div onClick={onClick}>
						<InContentWrapper>
							<LinkWrapper href={href}>
								<Badge
									content={badgeContent}
									isInvisible={!badgeContent}
									color={badgeColor}
									placement={badgePosition}
									className="mb-1"
								>

									{icon}
								</Badge>
							</LinkWrapper>
						</InContentWrapper>
					</div>
				</RightClickMenuOrNot>
			</div>
		</TooltipOrNot>
	);
});

export default LeftNavbar;

export {
	LeftNavBarIcon,
};