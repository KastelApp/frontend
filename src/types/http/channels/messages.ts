import { Embed } from "@/types/embed.ts";

export interface Message {
	id: string;
	author: Author;
	content: string;
	creationDate: string;
	editedDate: string | null;
	embeds: Embed[];
	nonce: string | null;
	replyingTo: MessageReply;
	attachments: unknown[];
	flags: number;
	allowedMentions: number;
	mentions: Mentions;
	pinned: boolean;
	deletable: boolean;
}

export type MessageReply = Message | null | string

export interface Author {
	id: string;
	username: string;
	globalNickname: string | null;
	tag: string;
	avatar: string | null;
	publicFlags: string;
	flags: string;
}

export interface Mentions {
	channels: string[];
	roles: string[];
	users: string[];
}

export interface CreateMessageOptions {
	content: string;
	nonce: string;
	embeds?: unknown[];
	replyingTo?: string;
	allowedMentions?: number;
	flags: number;
}
