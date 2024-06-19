import TextBasedChannel from "@/components/Channels/TextBasedChannel.tsx";
import ChannelNavBar from "@/components/NavBars/ChannelNavBar.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Channel = () => {
    const router = useRouter();

    // const channelId = router.query.channelId as string;
    // const guildId = router.query.guildId as string;

    // const { updateReadState, getGuild } = useGuildStore();

    // useEffect(() => {
    //     const guild = getGuild(guildId);

    //     const foundChannelState = guild?.channelProperties.find((channel) => channel.channelId === channelId);

    //     console.log(foundChannelState);

    //     // updateReadState(guildId, channelId, "62262959266730817")
    // }, [channelId])

    return (
        <AppLayout>
            <ChannelNavBar>
                <TextBasedChannel />
            </ChannelNavBar>
        </AppLayout>
    );
};

export default Channel;
