import type { Embed } from "@/components/Message/Embeds/RichEmbed.tsx";

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
    editMessage(channelId: string, messageId: string, options: Partial<Message>): void;
    replyToMessage(channelId: string, messageId: string, options: Partial<Message>): void;
}