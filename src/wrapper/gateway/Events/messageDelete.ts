import { MessageDeletePayload } from "@/types/payloads/events/messageDelete.ts";
import Logger from "@/utils/Logger.ts";
import Websocket from "@/wrapper/gateway/Websocket.ts";
import { useMessageStore } from "@/wrapper/Stores/MessageStore.ts";

const isMessageDelete = (payload: unknown): payload is MessageDeletePayload => {
    if (payload === null || typeof payload !== "object") return false;

    if (!("channelId" in payload)) return false;
    if (!("messageId" in payload)) return false;

    return true;
};

const messageDelete = (ws: Websocket, payload: unknown) => {
    if (!isMessageDelete(payload)) {
        Logger.warn("Invalid Message Delete Payload", "Wrapper | WebSocket");

        return;
    }

    useMessageStore.getState().removeMessage(payload.messageId);
};

export default messageDelete;