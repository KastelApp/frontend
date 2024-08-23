import { MessageCreatePayload } from "@/types/payloads/events/messageCreate.ts";
import getInviteCodes from "@/utils/getInviteCodes.ts";
import Logger from "@/utils/Logger.ts";
import Websocket from "@/wrapper/gateway/Websocket.ts";
import { MessageStates, useMessageStore } from "@/wrapper/Stores/MessageStore.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";

const isMessageCreate = (payload: unknown): payload is MessageCreatePayload => {
    if (payload === null || typeof payload !== "object") return false;

    if (!("channelId" in payload)) return false;
    if (!("content" in payload)) return false;

    return true;
};

const messageCreate = async (ws: Websocket, payload: unknown) => {
    if (!isMessageCreate(payload)) {
        Logger.warn("Invalid Message Create Payload", "Wrapper | WebSocket");

        return;
    }

    const invites = getInviteCodes(payload.content);
    const discordInvites = getInviteCodes(payload.content, true);

    await useUserStore.getState().fetchUser(payload.author.id);

    if (payload.replyingTo && "author" in payload.replyingTo) {
        await useUserStore.getState().fetchUser(payload.replyingTo.author.id);
    }

    useMessageStore.getState().addMessage({
        id: payload.id,
        authorId: payload.author.id,
        embeds: payload.embeds,
        content: payload.content,
        creationDate: new Date(payload.creationDate),
        editedDate: payload.editedDate ? new Date(payload.editedDate) : null,
        nonce: payload.nonce,
        replyingTo: payload.replyingTo ? "messageId" in payload.replyingTo ? payload.replyingTo.messageId : "id" in payload.replyingTo ? payload.replyingTo.id : null : null,
        attachments: payload.attachments,
        flags: payload.flags,
        allowedMentions: payload.allowedMentions,
        mentions: payload.mentions,
        channelId: payload.channelId,
        deletable: payload.deletable,
        invites,
        discordInvites,
        pinned: payload.pinned,
        state: MessageStates.Sent
    }, true);
};

export default messageCreate;