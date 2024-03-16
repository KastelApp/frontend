export interface EventPayload {
    op: number;
    event: "Typing" | "MessageCreate" | "PresencesUpdate" | "GuildCreate" | "GuildMemberAdd" | "GuildDelete"
    data: unknown;
    seq: number;
}