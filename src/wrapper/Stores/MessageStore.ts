import type { Embed } from "@/components/Message/Embeds/RichEmbed.tsx";
import { create } from "zustand";
import { useAPIStore } from "../Stores.ts";
import Logger from "@/utils/Logger.ts";
import { CreateMessageOptions, Message as MessageData } from "@/types/http/channels/messages.ts"
import { usePerChannelStore } from "./ChannelStore.ts";
import getInviteCodes from "@/utils/getInviteCodes.ts";
import { useUserStore } from "./UserStore.ts";
import fastDeepEqual from "fast-deep-equal";
import { fakeUserIds, messageFlags, snowflake } from "@/utils/Constants.ts";
import safePromise from "@/utils/safePromise.ts";
import { isErrorResponse } from "@/types/http/error.ts";

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
    addMessage(message: Message, updateMessageIfNonce?: boolean): void;
    /**
     * This just removes from the store, This does NOT delete the message API wise
     */
    removeMessage(id: string): void;
    getMessage(id: string): Message | undefined;
    getMessages(channelId: string): Message[];
    deleteMessage(id: string): Promise<void>;
    createMessage(channelId: string, options: Partial<Message>): Promise<void>;
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
        // ? if the nonce is null, we ignore it else we find the message thats nonce is the same as the message id / message nonce
        const foundNonceMessage = get().messages.find((msg) => msg.nonce !== null && (msg.nonce === message.nonce || msg.id === message.nonce));

        if (!fastDeepEqual(foundMessage, message)) { // ? prevents useless re-renders
            set({
                messages: [
                    ...get().messages.filter((msg) => msg.id !== message.id && msg.nonce === null || (msg.nonce !== message.nonce && msg.id !== message.nonce)),
                    {
                        ...foundNonceMessage,
                        ...foundMessage,
                        ...message
                    }
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
    deleteMessage: async (id) => {
        const message = get().messages.find((message) => message.id === id);

        if (!message) return;

        const api = useAPIStore.getState().api;

        if (!api) {
            Logger.warn("API not ready", "MessageStore");

            return;
        }

        const [res, error] = await safePromise(api.del<unknown, unknown>({
            url: `/channels/${message.channelId}/messages/${message.id}`
        }));

        if (error || !res || res.status !== 204) {
            Logger.warn("Failed to delete message", "MessageStore");

            return;
        }

        get().removeMessage(id);

        return;
    },
    createMessage: async (channelId, options) => {
        const message: Message = {
            id: snowflake.generate(),
            authorId: useUserStore.getState().getCurrentUser()?.id ?? "",
            embeds: [],
            content: "",
            creationDate: new Date(),
            editedDate: null,
            nonce: snowflake.generate(),
            replyingTo: null,
            attachments: [],
            flags: messageFlags.Normal,
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

        const api = useAPIStore.getState().api;

        if (!api) {
            Logger.warn("API not ready", "MessageStore");
            
            get().editMessage(message.id, {
                state: MessageStates.Failed
            });

            return;
        }

        const [res, error] = await safePromise(api.post<CreateMessageOptions, MessageData>({
            url: `/channels/${channelId}/messages`,
            data: {
                content: message.content,
                embeds: message.embeds,
                nonce: message.nonce!,
                replyingTo: message.replyingTo ?? undefined,
                allowedMentions: message.allowedMentions,
                flags: message.flags
            }
        }));

        if (error || !res || res.status !== 200) {
            Logger.warn("Failed to send message", "MessageStore");

            get().editMessage(message.id, {
                state: MessageStates.Failed
            });

            if (
                isErrorResponse<{
                    message: {
                        code: "PhishingDetected";
                        message: string;
                    };
                }>(res?.body)
            ) {
                if (res.body.errors.message.code === "PhishingDetected") {
                    get().addMessage({
                        id: snowflake.generate(),
                        authorId: fakeUserIds.kiki,
                        embeds: [],
                        content: "I'm sorry, but it seems like your message contained a phishing link. I've blocked it from being sent, please try again without the link.",
                        creationDate: new Date(),
                        editedDate: null,
                        nonce: null,
                        replyingTo: null,
                        attachments: [],
                        flags: messageFlags.System,
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
                        state: MessageStates.SystemMessage
                    });

                    return;
                }
            }

            get().addMessage({
                id: snowflake.generate(),
                authorId: fakeUserIds.kiki,
                embeds: [],
                content: "I'm sorry, though it seems I couldn't get your message to the server, this may be for a number of reasons such as rate limits, internal server errors or just a hiccup in the system. Please try again later.",
                creationDate: new Date(),
                editedDate: null,
                nonce: null,
                replyingTo: null,
                attachments: [],
                flags: messageFlags.System,
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
                state: MessageStates.SystemMessage
            })

            return;
        }

        get().addMessage({
            id: res.body.id,
            authorId: res.body.author.id,
            embeds: [],
            content: res.body.content,
            creationDate: new Date(res.body.creationDate),
            editedDate: res.body.editedDate ? new Date(res.body.editedDate) : null,
            nonce: res.body.nonce,
            replyingTo: res.body.replyingTo ? "messageId" in res.body.replyingTo ? res.body.replyingTo.messageId : "id" in res.body.replyingTo ? res.body.replyingTo.id : null : null,
            attachments: res.body.attachments,
            flags: res.body.flags,
            allowedMentions: res.body.allowedMentions,
            mentions: res.body.mentions,
            channelId,
            deletable: res.body.deletable,
            invites: getInviteCodes(res.body.content),
            discordInvites: getInviteCodes(res.body.content, true),
            pinned: res.body.pinned,
            state: MessageStates.Sent
        }, true)
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