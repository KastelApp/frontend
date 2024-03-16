import { CreateMessageOptions, Message as MessageType } from "$/types/http/channels/messages.ts";
import Message from "../Message.ts";
import BaseChannel from "./BaseChannel.ts";
import { useMessageStore, useUserStore } from "$/utils/Stores.ts";
import constants from "$/utils/constants.ts";

class TextBasedChannel extends BaseChannel {
    public async fetchMessages(options?: {
        limit: number,
        before?: string,
        after?: string,
        around?: string;
    }) {
        const params = new URLSearchParams();

        if (options?.limit) params.append("limit", options.limit.toString());
        if (options?.before) params.append("before", options.before);
        if (options?.after) params.append("after", options.after);
        if (options?.around) params.append("around", options.around);

        const request = await this.ws.client?.api.get<MessageType[]>(`/channels/${this.id}/messages${params.size > 0 ? `?${params}` : ""}`);

        if (!request?.ok || request.status > 200) return null;

        const json = await request.json();

        const finalMessages: Message[] = [];

        for (const msg of json) {
            finalMessages.push(new Message(this.ws, msg, "sent", this.id));
        }

        return finalMessages;
    }

    public async sendMessage(opts: {
        content: string;
        replyingTo?: string;
    }) {
        const nonce = this.ws.snowflake.generate();

        const tempMessage = new Message(this.ws, {
            nonce,
            content: opts.content,
            author: useUserStore.getState().getCurrentUser()!,
            ...(opts.replyingTo ? {
                replyingTo: {
                    channelId: this.id,
                    messageId: opts.replyingTo
                }
            } : {}),
        }, "sending", this.id);

        const msgs = useMessageStore.getState();

        msgs.addMessage(tempMessage);

        const request = await this.ws.client?.api.post<MessageType, CreateMessageOptions>(`/channels/${this.id}/messages`, {
            content: opts.content,
            nonce,
            flags: constants.messageFlags.Normal,
            replyingTo: opts.replyingTo,
            allowedMentions: constants.allowedMentions.All
        });

        if (!request?.ok || request.status > 200) return tempMessage.fastUpdate({}, "failed");

        const json = await request.json();

        return tempMessage.fastUpdate(json, "sent");
    }

    public async sendTyping() {
        const request = await this.ws.client?.api.post(`/channels/${this.id}/typing`);

        if (!request?.ok || request.status > 200) return false;

        return true;
    }

    public async ackChannel() {
        const request = await this.ws.client?.api.post(`/channels/${this.id}/ack`);

        if (!request?.ok || request.status > 200) return false;

        return true;
    }
}

export default TextBasedChannel;