import { ReadyPayload } from "@/types/payloads/ready.ts";
import {
	GuildMemberAddPayload,
	GuildMemberChunkPayload,
	MessageCreatePayload,
	PresencesUpdatePayload,
	TypingPayload,
} from "./events";
import { HelloPayload } from "@/types/payloads/hello.ts";
import { MessageDeletePayload } from "@/types/payloads/events/messageDelete.ts";

export interface EventPayload {
	op: number;
	event?:
		| "Typing"
		| "MessageCreate"
		| "MessageUpdate"
		| "PresencesUpdate"
		| "GuildCreate"
		| "GuildMemberAdd"
		| "GuildDelete"
		| "GuildMemberChunk"
		| "GuildMemberRemove"
		| "MessageDelete";
	data:
		| TypingPayload
		| MessageCreatePayload
		| PresencesUpdatePayload
		| GuildMemberAddPayload
		| GuildMemberChunkPayload
		| Record<string, unknown>
		| ReadyPayload
		| HelloPayload
		| MessageDeletePayload;
	seq?: number;
}
