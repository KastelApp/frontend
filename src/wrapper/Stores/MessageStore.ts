import type { Embed } from "@/components/Message/Embeds/RichEmbed.tsx";
import { create } from "zustand";
import { useAPIStore } from "../Stores.ts";
import Logger from "@/utils/Logger.ts";
import { Message as MessageData } from "@/types/http/channels/messages.ts"
import { usePerChannelStore } from "./ChannelStore.ts";
import getInviteCodes from "@/utils/getInviteCodes.ts";
import { useUserStore } from "./UserStore.ts";
import fastDeepEqual from "fast-deep-equal";

export enum MessageStates {
    /**
     * The message was sent successfully or received successfully
     */
    Sent = "SENT",
    /**
     * This is a client side only state, its just to signify to the user that the message is being sent
     */
    Sending = "SENDING",
    /**
     * The message failed to send (could be due to rate limits, internal server error's etc)
     */
    Failed = "FAILED",
    /**
     * If the message state is somehow unknown
     */
    Unknown = "UNKNOWN",
    /**
     * The message is shown as our internal system message and is closable (plus has a cool little bg color :3)
     */
    SystemMessage = "SYSTEM_MESSAGE"
}

export interface Message {
    id: string;
    authorId: string;
    embeds: Embed[];
    content: string;
    creationDate: Date;
    editedDate: Date | null;
    /**
     * Nonce is really only a client side thing (though bots can use it if they wish) it just stops duplicate messages in case of a hiccup
     */
    nonce: string | null;
    replyingTo: string | null;
    attachments: unknown[];
    flags: number;
    allowedMentions: number;
    mentions: {
        channels: string[];
        roles: string[];
        users: string[];
    };
    pinned: boolean;
    deletable: boolean;
    invites: string[];
    /**
     * We allow will render Discord invite's as a normal invite, the join button will open a new tab though
     * This is just so people can easily link two server's together
     */
    discordInvites: string[];
    channelId: string;
    /**
     * The state of the message
     */
    state: MessageStates;
}

export interface MessageStore {
    messages: Message[];
    addMessage(message: Message): void;
    /**
     * This just removes from the store, This does NOT delete the message API wise
     */
    removeMessage(id: string): void;
    getMessage(id: string): Message | undefined;
    getMessages(channelId: string): Message[];
    deleteMessage(id: string): void;
    createMessage(channelId: string, options: Partial<Message>): void;
    editMessage(messageId: string, options: Partial<Message>): void;
    replyToMessage(channelId: string, messageId: string, options: Partial<Message>): void;
    fetchMessages(channelId: string, options?: {
        limit: number;
        before?: string;
        after?: string;
        around?: string;
    }): Promise<boolean>;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
    messages: [],
    addMessage: (message) => {
        const foundMessage = get().messages.find((msg) => msg.id === message.id);

        if (!fastDeepEqual(foundMessage, message)) { // ? prevents useless re-renders
            set({
                messages: [
                    ...get().messages.filter((msg) => msg.id !== message.id),
                    message
                ]
            })
        }
    },
    removeMessage: (id) => {
        set({
            messages: get().messages.filter((message) => message.id !== id)
        });
    },
    getMessage: (id) => get().messages.find((message) => message.id === id),
    getMessages: (channelId) => get().messages.filter((message) => message.channelId === channelId),
    deleteMessage: (id) => {
        const message = get().messages.find((message) => message.id === id);

        if (!message) return;

        message.deletable = false;

        set({
            messages: get().messages.map((message) => message.id === id ? { ...message, deletable: false } : message)
        });
    },
    createMessage: (channelId, options) => {
        const message: Message = {
            id: "",
            authorId: useUserStore.getState().getCurrentUser()?.id ?? "",
            embeds: [],
            content: "",
            creationDate: new Date(),
            editedDate: null,
            nonce: null,
            replyingTo: null,
            attachments: [],
            flags: 0,
            allowedMentions: 0,
            mentions: {
                channels: [],
                roles: [],
                users: []
            },
            pinned: false,
            deletable: true,
            invites: [],
            discordInvites: [],
            channelId,
            ...options,
            state: MessageStates.Sending
        };

        get().addMessage(message);
    },
    editMessage: (messageId, options) => {
        const message = get().messages.find((message) => message.id === messageId);

        if (!message) return;

        console.log("Editing message", message, options);

        set({
            messages: get().messages.map((message) => message.id === messageId ? { ...message, ...options } : message)
        });
    },
    replyToMessage: (channelId, messageId, options) => {
        const message = get().messages.find((message) => message.id === messageId);

        if (!message) return;

        console.log("Replying to message", message, options);
    },
    fetchMessages: async (channelId, options) => {
        const api = useAPIStore.getState().api;

        if (!api) {
            Logger.warn("API not ready", "MessageStore");

            return false;
        }

        const messages = await api.get<unknown, MessageData[]>({
            url: `/channels/${channelId}/messages?limit=${options?.limit ?? 50}`,
        });

        if (!messages.ok || messages.status !== 200) {
            Logger.warn("Failed to fetch messages", "MessageStore");

            return false;
        }

        for (const message of messages.body) {
            // ? invites are like this: https://kastelapp.com/invite/inviteCode or https://kastel.dev/invitecode (or they may not have https:// so just kastel.dev/invitecode)
            // ? we need to get all the codes
            const invites = getInviteCodes(message.content)
            const discordInvites = getInviteCodes(message.content, true);

            get().addMessage({
                id: message.id,
                authorId: message.author.id,
                // embeds: message.embeds,
                embeds: [],
                content: message.content,
                creationDate: new Date(message.creationDate),
                editedDate: message.editedDate ? new Date(message.editedDate) : null,
                nonce: message.nonce,
                replyingTo: message.replyingTo ? "messageId" in message.replyingTo ? message.replyingTo.messageId : "id" in message.replyingTo ? message.replyingTo.id : null : null,
                attachments: message.attachments,
                flags: message.flags,
                allowedMentions: message.allowedMentions,
                mentions: message.mentions,
                channelId,
                deletable: message.deletable,
                invites,
                discordInvites,
                pinned: message.pinned,
                state: MessageStates.Sent
            })
        }

        if (messages.body.length === 0) {
            usePerChannelStore.getState().updateChannel(channelId, {
                ...(options?.after ? { hasMoreAfter: false } : {}),
                ...(options?.before ? { hasMoreBefore: false } : {})
            })
        }

        if (messages.body.length < (options?.limit ?? 50)) {
            usePerChannelStore.getState().updateChannel(channelId, {
                ...(options?.after ? { hasMoreAfter: false } : {}),
                ...(options?.before ? { hasMoreBefore: false } : {}),
                ...(!options?.after && !options?.before ? { hasMoreAfter: false, hasMoreBefore: false } : {})
            })
        }

        return true;
    }
}));