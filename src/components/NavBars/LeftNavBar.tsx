// ? The left navbar is inspired by discord due to a ton of users wanting it since they are familiar with it.
// ? Though the bottom bar is the one we will care about the most, the left navbar is still a good option for those who want it.
import { useCallback } from "react";
import { Compass } from "lucide-react";
import cn from "@/utils/cn.ts";
import { Avatar } from "@nextui-org/react";
import UserOptions from "../Dropdowns/UserOptions.tsx";
import { useGuildSettingsStore, useSettingsStore } from "@/wrapper/Stores.ts";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useRouter } from "next/router";
import Draggables from "../DraggableComponent.tsx";
import { NavBarIcon } from "./NavBarIcon.tsx";
import AddGuildButton from "../AddGuildButton.tsx";
// import { Copy, Pen, Pin, Reply, Trash2 } from "lucide-react";
import { Divider } from "@nextui-org/react";
import { snowflake } from "@/utils/Constants.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";

const LeftNavBar = () => {
	const { isSideBarOpen } = useSettingsStore();
	const { guilds } = useGuildStore();
	const { guildSettings } = useGuildSettingsStore();
	const { getChannelsWithValidPermissions, getTopChannel } = useChannelStore();
	const router = useRouter();

	const [guildId] = router?.query?.slug as string[];
	const currentUser = useUserStore((s) => s.getCurrentUser());

	const mappedGuilds = useCallback(() => {
		return (
			<Draggables
				disableGhostElement
				items={guilds.filter((guild) => !guild.unavailable && !guild.partial)}
				onDrop={console.log}
				render={(item, index) => {
					let hasUnread = false;

					const gotChannels = getChannelsWithValidPermissions(item.id);
					const foundGuildSettings = guildSettings[item.id];

					for (const channel of gotChannels) {
						const foundChannel = item.channelProperties.find(
							(channelProperty) => channelProperty.channelId === channel.id,
						);
						if (foundChannel?.lastMessageAckId !== channel.lastMessageId) {
							if (
								foundChannel?.lastMessageAckId &&
								channel.lastMessageId &&
								snowflake.timeStamp(foundChannel.lastMessageAckId) > snowflake.timeStamp(channel.lastMessageId)
							) {
								continue;
							}

							hasUnread = true;

							break;
						}
					}

					const topChannel = getTopChannel(item.id);

					return (
						<NavBarIcon
							href={`/app/guilds/${item.id}${foundGuildSettings?.lastChannelId ? `/channels/${foundGuildSettings.lastChannelId}` : topChannel ? `/channels/${topChannel.id}` : ""}`}
							badgePosition="bottom-right"
							badgeColor="danger"
							// badgeContent={item.mentionCount === "0" ? undefined : item.mentionCount}
							key={index}
							icon={
								<Avatar
									name={item.name}
									src={item.icon ?? undefined}
									className="mt-1.5 h-10 w-10 transform rounded-3xl transition-all duration-300 ease-in-out group-hover:rounded-xl"
									imgProps={{ className: "transition-none" }}
								/>
							}
							description={item.name}
							contextMenuItemsProps={[
								{
									label: "Test",
								},
							]}
							hasUnReadMessages={hasUnread}
							isActive={item.id === guildId}
						/>
					);
				}}
			/>
		);
	}, [guilds, guildId]);

	return (
		<>
			<div className={cn("block", isSideBarOpen ? "" : "hidden")}>
				<div className="fixed left-0 top-0 z-[5] flex h-full w-16 flex-col overflow-y-auto overflow-x-hidden shadow-lg">
					<UserOptions orientation="vertical" type="context">
						<NavBarIcon
							icon={
								<div className="max-h-9 min-h-9 min-w-9 max-w-9">
									<Avatar
										src={
											useUserStore.getState().getAvatarUrl(currentUser!.id, currentUser!.avatar) ??
											useUserStore.getState().getDefaultAvatar(currentUser!.id)
										}
										className="max-h-9 min-h-9 min-w-9 max-w-9 transform transition-all duration-300 ease-in-out hover:scale-95"
										imgProps={{ className: "transition-none" }}
									/>
								</div>
							}
							isBackgroundDisabled
							badgeContent="9+"
							badgePosition="bottom-right"
							badgeColor="danger"
							href="/app"
							description="Right click to open context menu"
							delay={1000}
							isNormalIcon
						/>
					</UserOptions>
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
