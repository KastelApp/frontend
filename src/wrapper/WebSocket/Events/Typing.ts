import { TypingPayload } from "@/wrapper/types/payloads/events/index.ts";
import Websocket from "../WebSocket.ts";
import StringFormatter from "@/wrapper/utils/StringFormatter.ts";
import { useTypingStore } from "$/utils/Stores.ts";

const isTypingPayload = (data: unknown): data is TypingPayload => {
    if (typeof data !== "object" || data === null || data === undefined) return false;

    if (!("userId" in data)) return false;
    if (!("channelId" in data)) return false;

    return true;
}

const typing = (ws: Websocket, data: unknown) => {
    if (!isTypingPayload(data)) {
        StringFormatter.log(
            `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid Typing Payload")}`,
            data
        )

        return;
    }

    useTypingStore.getState().addTyping(data.channelId, data.userId, Date.now())
}

export default typing;