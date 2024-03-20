import { Member } from "../ready.ts";

export interface GuildMemberAddPayload extends Member {
    guildId: string;
    userId?: string;
}
