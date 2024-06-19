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
	data: unknown;
	seq?: number;
}
