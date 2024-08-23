// ? The left navbar is inspired by discord due to a ton of users wanting it since they are familiar with it.
// ? Though the bottom bar is the one we will care about the most, the left navbar is still a good option for those who want it.
import { useCallback } from "react";
import { Compass } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Avatar } from "@nextui-org/react";
import UserOptions from "../Dropdowns/UserOptions.tsx";
import { useSettingsStore } from "@/wrapper/Stores.ts";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useRouter } from "next/router";
import Draggables from "../DraggableComponent.tsx";
import { NavBarIcon } from "./NavBarIcon.tsx";
import AddGuildButton from "../AddGuildButton.tsx";
// import { Copy, Pen, Pin, Reply, Trash2 } from "lucide-react";
import { Divider } from "@nextui-org/react";
import { snowflake } from "@/utils/Constants.ts";

const LeftNavBar = () => {
	const { isSideBarOpen } = useSettingsStore();
	const { guilds } = useGuildStore();
	const { getChannelsWithValidPermissions, getTopChannel } = useChannelStore();
	const router = useRouter();

	const { guildId } = router.query as { guildId: string; };

	const mappedGuilds = useCallback(() => {
		return <Draggables disableGhostElement items={guilds.filter((guild) => !guild.unavailable && !guild.partial)} onDrop={console.log} render={(item, index) => {
			let hasUnread = false;

			const gotChannels = getChannelsWithValidPermissions(item.id);

			for (const channel of gotChannels) {
				const foundChannel = item.channelProperties.find((channelProperty) => channelProperty.channelId === channel.id);
				if (foundChannel?.lastMessageAckId !== channel.lastMessageId) {
					if (foundChannel?.lastMessageAckId && channel.lastMessageId && snowflake.timeStamp(foundChannel.lastMessageAckId) > snowflake.timeStamp(channel.lastMessageId)) {
						continue
					}

					hasUnread = true;

					break;
				}
			}

			const topChannel = getTopChannel(item.id);

			return (
				<NavBarIcon
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
					contextMenuItemsProps={[{
						label: "Test",
					}]}
					hasUnReadMessages={hasUnread}
					isActive={item.id === guildId}
				/>
			);
		}} />;
	}, [guilds, guildId]);

	return (
		<>
			<div className={twMerge("block", isSideBarOpen ? "" : "hidden")}>
				<div className="fixed left-0 top-0 h-full w-16 flex flex-col shadow-lg z-[5] overflow-y-auto overflow-x-hidden">
					<NavBarIcon
						icon={
							<div className="min-w-9 min-h-9 max-h-9 max-w-9">
								<Avatar
									src="/icon-1.png"
									className="min-w-9 min-h-9 max-h-9 max-w-9 hover:scale-95 transition-all duration-300 ease-in-out transform"
									imgProps={{ className: "transition-none" }}
								/>
							</div>
						}
						isBackgroundDisabled
						badgeContent="9+"
						badgePosition="bottom-right"
						badgeColor="danger"
						InContent={UserOptions as React.FC}
						href="/app"
						description="Right click to open context menu"
						delay={1000}
						isNormalIcon
					/>
					<Divider className="h-1" />
					{mappedGuilds()}
					<AddGuildButton />
					<NavBarIcon
						icon={<Compass className="mt-1.5" color="#acaebf" absoluteStrokeWidth />}
						description="Discover a guild"
						isDisabled
						isNormalIcon
					/>
				</div>
			</div>
		</>
	);
};


export default LeftNavBar;