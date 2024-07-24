import { ReadyPayload } from "@/types/payloads/ready.ts";
import { GuildMemberAddPayload, GuildMemberChunkPayload, MessageCreatePayload, PresencesUpdatePayload, TypingPayload } from "./events"
import { HelloPayload } from "@/types/payloads/hello.ts";

export interface EventPayload {
	op: number;
	event?:
	| "Typing"
	| "MessageCreate"
	| "PresencesUpdate"
	| "GuildCreate"
	| "GuildMemberAdd"
	| "GuildDelete"
	| "GuildMemberChunk"
	| "GuildMemberRemove";
	data: TypingPayload | MessageCreatePayload | PresencesUpdatePayload | GuildMemberAddPayload | GuildMemberChunkPayload | Record<string, unknown> | ReadyPayload | HelloPayload;
	seq?: number;
}