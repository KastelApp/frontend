import TextBasedChannel from "@/components/Channels/TextBasedChannel.tsx";
import ChannelNavBar from "@/components/NavBars/ChannelNavBar.tsx";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useRouter } from "next/router";

const Channel = () => {
    const router = useRouter();

    const { guildId, channelId } = router.query as { guildId: string; channelId: string; };

    const inGuild = useGuildStore((state) => state.getGuild(guildId));
    const channel = useChannelStore((state) => state.getChannel(channelId));

    if (!inGuild || !channel) {
        router.push("/app");

        return;
    }


    return (
        <ChannelNavBar>
            <TextBasedChannel />
        </ChannelNavBar>
    );
};

Channel.shouldHaveLayout = true;

export default Channel;
