import { ReadyPayload } from "@/types/payloads/ready.ts";
import {
	HubMemberAddPayload,
	HubMemberChunkPayload,
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
		| "HubCreate"
		| "HubMemberAdd"
		| "HubDelete"
		| "HubMemberChunk"
		| "HubMemberRemove"
		| "MessageDelete";
	data:
		| TypingPayload
		| MessageCreatePayload
		| PresencesUpdatePayload
		| HubMemberAddPayload
		| HubMemberChunkPayload
		| Record<string, unknown>
		| ReadyPayload
		| HelloPayload
		| MessageDeletePayload;
	seq?: number;
}
