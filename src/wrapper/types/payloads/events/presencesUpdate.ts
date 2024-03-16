export interface PresencesUpdatePayload {
    user: User;
    guildId: string;
    presences: Presence[];
}

export interface User {
    id: string;
    username: string;
    avatar: string | null;
    tag: string;
    publicFlags: string;
    flags: string;
}

export interface Presence {
    type: number;
    state: string | null;
    status: string;
    since: number;
    current: boolean;
}
