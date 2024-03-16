import { MessageCreatePayload } from "@/wrapper/types/payloads/events/index.ts";
import Websocket from "../WebSocket.ts";
import StringFormatter from "@/wrapper/utils/StringFormatter.ts";
import { useMessageStore, useTypingStore } from "$/utils/Stores.ts";
import Message from "$/Client/Structures/Message.ts";

const isMessageCreatePayload = (data: unknown): data is MessageCreatePayload => {
    if (typeof data !== "object" || data === null || data === undefined) return false;

    if (!("channelId" in data)) return false;
    if (!("author" in data)) return false;
    if (!("content" in data)) return false;

    return true;
}

const messageCreate = (ws: Websocket, data: unknown) => {
    if (!isMessageCreatePayload(data)) {
        StringFormatter.log(
            `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid MessageCreate Payload")}`,
            data
        )

        return;
    }

    const state = useMessageStore.getState();

    if (state.messages.find((msg) => msg.id === data.id || msg.nonce === data.nonce)) return;

    state.addMessage(new Message(ws, data, "sent", data.channelId));

    useTypingStore.getState().removeTyping(data.channelId, data.author.id);
}

export default messageCreate;