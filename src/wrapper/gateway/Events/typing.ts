import { TypingPayload } from "@/types/payloads/events/typing.ts";
import Logger from "@/utils/Logger.ts";
import Websocket from "@/wrapper/gateway/Websocket.ts";
import { usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";

const isTypingEvent = (payload: unknown): payload is TypingPayload => {
    if (payload === null || typeof payload !== "object") return false;

    if (!("channelId" in payload)) return false;
    if (!("userId" in payload)) return false;

    return true;
};

const typing = (ws: Websocket, payload: unknown) => {
    if (!isTypingEvent(payload)) {
        Logger.warn("Invalid Typing Payload", "Wrapper | WebSocket");

        return;
    }

    const channel = usePerChannelStore.getState().getChannel(payload.channelId);

    if (!channel) {
        Logger.warn("Channel not found", "Wrapper | WebSocket");

        return;
    }

    const foundUser = channel.typingUsers.find((user) => user.id === payload.userId);

    if (foundUser) {
        foundUser.started = Date.now();
    } else {
        channel.typingUsers.push({
            id: payload.userId,
            started: Date.now()
        });
    }

    channel.typingUsers = channel.typingUsers.filter((user) => Date.now() - user.started < 7000);

    usePerChannelStore.setState((s) => {
        s.updateChannel(payload.channelId, {
            typingUsers: channel.typingUsers
        });

        return s;
    })
};

export default typing;