import { Member } from "../ready.ts";

export interface GuildMemberChunkPayload {
	guildId: string;
	members: Member[];
}
