export interface Relationship {
    createdAt: string;
    nickname: string | null;
    pending: boolean;
    relationshipFlags: number;
    relationshipId: string;
    user?: never | {
        avatar: string | null;
        flags: string;
        globalNickname: string | null;
        publicFlags: string;
        tag: string;
        username: string;
        id: string;
    };
    userId?: never | string;
}