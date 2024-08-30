import TextBasedChannel from "@/components/Channels/TextBasedChannel.tsx";
import ChannelNavBar from "@/components/NavBars/ChannelNavBar.tsx";
import Logger from "@/utils/Logger.ts";
import { useGuildSettingsStore } from "@/wrapper/Stores.ts";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useRouter } from "next/router";
import { useEffect } from "react";

const GuildPages = () => {
    const router = useRouter();
    const [guildId, part, channelId, messageId] = router.query.slug as string[];
    const { getTopChannel } = useChannelStore();
    const inGuild = useGuildStore((state) => state.getGuild(guildId));
    const channel = useChannelStore((state) => state.getChannel(channelId));
    const { setGuildSettings, guildSettings } = useGuildSettingsStore();


    useEffect(() => {
        if (!router.isReady) return;

        if (part && part !== "channels") {
            Logger.debug(`Invalid Part: ${part}`, "Pages | GuildPage");

            router.push("/app/guilds");

            return;
        }

        if (inGuild?.unavailable) {
            Logger.debug("Guild not found", "Pages | GuildPage");

            router.push("/app/guilds");

            return;
        }

        if (channelId && !channel) {
            Logger.debug("Channel not found", "Pages | GuildPage");

            router.push(`/app/guilds/${guildId}`);

            return;
        }

        if (!guildId) return;

        if (!channelId) {
            const topChannel = getTopChannel(guildId);

            if (topChannel) {
                Logger.debug("Redirecting to top channel", "Pages | GuildPage");

                router.push(`/app/guilds/${guildId}/channels/${topChannel.id}`);

                return;
            }
        }

        if (channelId) {
            setGuildSettings(guildId, {
                lastChannelId: channelId,
                memberBarHidden: guildSettings[guildId]?.memberBarHidden ?? false,
            });
        }

    }, [router, guildId, channelId, part, messageId]);

    return (
        <>
            <ChannelNavBar isChannelHeaderHidden={!channelId} isMemberBarHidden={!channelId} currentGuildId={guildId} currentChannelId={channelId}>
                {!channelId && <div className="flex justify-center items-center h-screen">
                    <div className="text-center -mt-[20%] space-y-2">
                        <h1 className="text-white font-semibold text-lg">No Text Channels</h1>
                        <p className="text-gray-500 w-96">There's seems to be no text channels in this guild, or you do not have access to any</p>
                    </div>
                </div>}

                {channelId && <TextBasedChannel />}
            </ChannelNavBar>
        </>
    );
};

GuildPages.shouldHaveLayout = true;

export default GuildPages;