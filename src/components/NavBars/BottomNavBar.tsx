import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useRouter } from "next/router";
import { useCallback } from "react";
import Draggables from "../DraggableComponent.tsx";
import { Avatar } from "@nextui-org/react";
import { NavBarIcon } from "./NavBarIcon.tsx";

const BottomNavBar = () => {
	const { guilds } = useGuildStore();
	const { getChannelsWithValidPermissions, getTopChannel } = useChannelStore();
	const router = useRouter();

	const { guildId } = router.query as { guildId: string; };

	const mappedGuilds = useCallback(() => {
		return <Draggables items={guilds} onDrop={console.log} orientation="horizontal"
        render={(item, index) => {
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
                    orientation="horizontal"
				/>
			);
		}} />;
	}, [guilds, guildId]);

    return (
        <div className="absolute z-50">
            Inky
        </div>
    )
}

export default BottomNavBar;