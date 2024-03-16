export interface EventPayload {
    op: number;
    event: "Typing" | "MessageCreate" | "PresencesUpdate" | "GuildCreate" | "GuildMemberAdd" | "GuildDelete" | "GuildMemberChunk"
    data: unknown;
    seq: number;
}