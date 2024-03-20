import Websocket from "../WebSocket.ts";
import StringFormatter from "@/wrapper/utils/StringFormatter.ts";
import { GuildMemberAddPayload } from "$/types/payloads/events/guildMemberAdd.ts";
import { useMemberStore } from "$/utils/Stores.ts";

const isGuildMemberRemovePayload = (data: unknown): data is GuildMemberAddPayload => {
    if (typeof data !== "object" || data === null || data === undefined) return false;

    if (!("guildId" in data)) return false;

    return "userId" in data;
}

const guildMemberRemove = (ws: Websocket, data: unknown) => {
    if (!isGuildMemberRemovePayload(data)) {
        StringFormatter.log(
            `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid GuildMemberRemove Payload")}`,
            data
        )

        return;
    }

    const memberStore = useMemberStore.getState();

    if (memberStore.members.find((m) => m.userId === data.userId && m.guildId === data.guildId)) {
        memberStore.members.filter((m) => m.userId !== data.userId && m.guildId !== data.guildId)
    }
}

export default guildMemberRemove;