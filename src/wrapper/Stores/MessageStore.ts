import { create } from "zustand";
import { useAPIStore } from "../Stores.tsx";
import Logger from "@/utils/Logger.ts";
import { CreateMessageOptions, Message as MessageData } from "@/types/http/channels/messages.ts";
import getInviteCodes from "@/utils/getInviteCodes.ts";
import { useUserStore } from "./UserStore.ts";
import fastDeepEqual from "fast-deep-equal";
import { allowedMentions, fakeUserIds, messageFlags, snowflake } from "@/data/constants.ts";
import safePromise from "@/utils/safePromise.ts";
import { isErrorResponse } from "@/types/http/error.ts";
import { useInviteStore } from "@/wrapper/Stores/InviteStore.ts";
import { Embed } from "@/types/embed.ts";

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
	SystemMessage = "SYSTEM_MESSAGE",
}

export enum MessageContext {
	Unknown,
	Gateway,
	API,
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

	context: MessageContext;
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
	editMessage(messageId: string, options: Partial<Message>, noApi?: boolean): void;
	fetchMessages(
		channelId: string,
		options?: {
			limit: number;
			before?: string;
			after?: string;
			around?: string; // ? fun fact: I forgot to implement this on the backend for awhile and was wondering why it wasn't working lol.
		},
	): Promise<{
		success: boolean;
		messages: Message[];
	}>;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
	messages: [],
	addMessage: (message) => {
		const foundMessage = get().messages.find((msg) => msg.id === message.id);
		// ? if the nonce is null, we ignore it else we find the message thats nonce is the same as the message id / message nonce
		const foundNonceMessage = get().messages.find(
			(msg) => msg.nonce !== null && (msg.nonce === message.nonce || msg.id === message.nonce),
		);

		if (!fastDeepEqual(foundMessage, message)) {
			// ? prevents useless re-renders
			set({
				messages: [
					...get().messages.filter(
						(msg) =>
							(msg.id !== message.id && msg.nonce === null) ||
							(msg.nonce !== message.nonce && msg.id !== message.nonce),
					),
					{
						...foundNonceMessage,
						...foundMessage,
						...message,
					},
				],
			});
		}
	},
	removeMessage: (id) => {
		set({
			messages: get().messages.filter((message) => message.id !== id),
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

		const [res, error] = await safePromise(
			api.del<unknown, unknown>({
				url: `/channels/${message.channelId}/messages/${message.id}`,
			}),
		);

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
			allowedMentions: allowedMentions.All!,
			mentions: {
				channels: [],
				roles: [],
				users: [],
			},
			pinned: false,
			deletable: true,
			invites: [],
			discordInvites: [],
			channelId,
			...options,
			state: MessageStates.Sending,
			context: MessageContext.Unknown,
		};

		get().addMessage(message);

		const api = useAPIStore.getState().api;

		if (!api) {
			Logger.warn("API not ready", "MessageStore");

			get().editMessage(message.id, {
				state: MessageStates.Failed,
			});

			return;
		}

		const [res, error] = await safePromise(
			api.post<CreateMessageOptions, MessageData>({
				url: `/channels/${channelId}/messages`,
				data: {
					content: message.content,
					embeds: message.embeds,
					nonce: message.nonce!,
					replyingTo: message.replyingTo ?? undefined,
					allowedMentions: message.allowedMentions,
					flags: message.flags,
				},
			}),
		);

		if (error || !res || res.status !== 200) {
			Logger.warn("Failed to send message", "MessageStore");

			get().editMessage(message.id, {
				state: MessageStates.Failed,
			});

			if (
				isErrorResponse<{
					message: {
						code: "PhishingDetected";
						message: string;
					};
				}>(res?.body)
			) {
				if (res.body.errors.message?.code === "PhishingDetected") {
					get().addMessage({
						id: snowflake.generate(),
						authorId: fakeUserIds.kiki,
						embeds: [],
						content:
							"I'm sorry, but it seems like your message contained a phishing link. I've blocked it from being sent, please try again without the link.",
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
							users: [],
						},
						pinned: false,
						deletable: true,
						invites: [],
						discordInvites: [],
						channelId,
						state: MessageStates.SystemMessage,
						context: MessageContext.Unknown,
					});

					return;
				}
			}

			get().addMessage({
				id: snowflake.generate(),
				authorId: fakeUserIds.kiki,
				embeds: [],
				content:
					"I'm sorry, though it seems I couldn't get your message to the server, this may be for a number of reasons such as rate limits, internal server errors or just a hiccup in the system. Please try again later.",
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
					users: [],
				},
				pinned: false,
				deletable: true,
				invites: [],
				discordInvites: [],
				channelId,
				state: MessageStates.SystemMessage,
				context: MessageContext.Unknown,
			});

			return;
		}

		get().addMessage(
			{
				id: res.body.id,
				authorId: res.body.author.id,
				embeds: [],
				content: res.body.content,
				creationDate: new Date(res.body.creationDate),
				editedDate: res.body.editedDate ? new Date(res.body.editedDate) : null,
				nonce: res.body.nonce,
				replyingTo: res.body.replyingTo
					? "messageId" in res.body.replyingTo
						? res.body.replyingTo.messageId
						: "id" in res.body.replyingTo
							? res.body.replyingTo.id
							: null
					: null,
				attachments: res.body.attachments,
				flags: res.body.flags,
				allowedMentions: res.body.allowedMentions,
				mentions: res.body.mentions,
				channelId,
				deletable: res.body.deletable,
				invites: getInviteCodes(res.body.content),
				discordInvites: getInviteCodes(res.body.content, true),
				pinned: res.body.pinned,
				state: MessageStates.Sent,
				context: MessageContext.Unknown,
			},
			true,
		);
	},
	editMessage: (messageId, options) => {
		const message = get().messages.find((message) => message.id === messageId);

		if (!message) return;

		console.log("Editing message", message, options);

		set({
			messages: get().messages.map((message) => (message.id === messageId ? { ...message, ...options } : message)),
		});
	},
	fetchMessages: async (channelId, options) => {
		const api = useAPIStore.getState().api;

		if (!api) {
			Logger.warn("API not ready", "MessageStore");

			return {
				success: false,
				messages: [],
			};
		}

		const newParams = new URLSearchParams();

		if (options?.after) {
			newParams.append("after", options.after);
		}

		if (options?.before) {
			newParams.append("before", options.before);
		}

		if (options?.around) {
			newParams.append("around", options.around);
		}

		newParams.append("limit", String(options?.limit ?? 50));

		const messages = await api.get<unknown, MessageData[]>({
			url: `/channels/${channelId}/messages?${newParams.toString()}`,
		});

		if (!messages.ok || messages.status !== 200) {
			Logger.warn("Failed to fetch messages", "MessageStore");

			return {
				success: false,
				messages: [],
			};
		}

		const msgs: Message[] = [];

		for (const message of messages.body) {
			// ? invites are like this: https://kastelapp.com/invite/inviteCode or https://kstl.app/invitecode (or they may not have https:// so just kastel.dev/invitecode)
			// ? we need to get all the codes
			const invites = getInviteCodes(message.content);
			const discordInvites = getInviteCodes(message.content, true);

			const msg: Message = {
				id: message.id,
				authorId: message.author.id,
				embeds: message.embeds,
				content: message.content,
				creationDate: new Date(message.creationDate),
				editedDate: message.editedDate ? new Date(message.editedDate) : null,
				nonce: message.nonce,
				replyingTo: message.replyingTo
					? "messageId" in message.replyingTo
						? message.replyingTo.messageId
						: "id" in message.replyingTo
							? message.replyingTo.id
							: null
					: null,
				attachments: message.attachments,
				flags: message.flags,
				allowedMentions: message.allowedMentions,
				mentions: message.mentions,
				channelId,
				deletable: message.deletable,
				invites,
				discordInvites,
				pinned: message.pinned,
				state: MessageStates.Sent,
				context: MessageContext.API,
			};

			get().addMessage(msg);
			msgs.push(msg);
			useUserStore.getState().addUser(message.author);
		}

		const invites = Array.from(new Set(msgs.flatMap((msg) => msg.invites)));

		for (const invite of invites) {
			useInviteStore.getState().fetchInvite(invite);
		}

		return {
			success: true,
			messages: msgs,
		};
	},
}));
