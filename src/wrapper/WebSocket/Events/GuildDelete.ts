import Websocket from "../WebSocket.ts";
import StringFormatter from "@/wrapper/utils/StringFormatter.ts";
import { useGuildStore, useChannelStore, useRoleStore, useMemberStore, useMessageStore } from "$/utils/Stores.ts";

const isGuildDeletePayload = (data: unknown): data is { guildId: string } => {
    if (typeof data !== "object" || data === null || data === undefined) return false;

    return "guildId" in data;
}

const guildDelete = (ws: Websocket, data: unknown) => {
    if (!isGuildDeletePayload(data)) {
        StringFormatter.log(
            `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid Guild Delete Payload")}`,
            data
        )

        return;
    }

    const guildState = useGuildStore.getState();

    guildState.setGuilds(guildState.guilds.filter(guild => guild.id !== data.guildId));

    const channelState = useChannelStore.getState();

    const channelIdsBye: string[] = [];

    channelState.setChannels(channelState.channels.filter(channel => {
        if (channel.guildId !== data.guildId) return true;

        channelIdsBye.push(channel.id);

        return false;
    }));

    const roleState = useRoleStore.getState();

    roleState.setRoles(roleState.roles.filter(role => role.guildId !== data.guildId));

    const memberState = useMemberStore.getState();

    memberState.setMembers(memberState.members.filter(member => member.guildId !== data.guildId));

    const messageState = useMessageStore.getState();

    messageState.setMessages(messageState.messages.filter(message => !channelIdsBye.includes(message.channelId ?? "")));
}

export default guildDelete;