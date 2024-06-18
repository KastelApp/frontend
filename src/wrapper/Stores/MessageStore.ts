import type { Embed } from "@/components/Message/Embeds/RichEmbed.tsx";
import { create } from "zustand";

export interface Message {
    id: string;
    authorId: string;
    embeds: Embed[];
    content: string;
    creationDate: Date;
    editedDate: Date | null;
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
    invites: string[]
    channelId: string;
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
    }): void;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
    messages: [],
    addMessage: (message) => {
        set({
            messages: [
                ...get().messages,
                message
            ]
        });
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
            authorId: "",
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
            channelId,
            ...options
        };

        set({
            messages: [
                ...get().messages,
                message
            ]
        });
    },
    editMessage: (messageId, options) => {
        const message = get().messages.find((message) => message.id === messageId);

        if (!message) return;

       console.log("Editing message", message, options);
    },
    replyToMessage: (channelId, messageId, options) => {
        const message = get().messages.find((message) => message.id === messageId);

        if (!message) return;

        console.log("Replying to message", message, options);
    },
    fetchMessages: async (channelId, options) => {
        console.log("Fetching messages", channelId, options);
    }
}))