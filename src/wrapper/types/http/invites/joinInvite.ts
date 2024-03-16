export interface JoinInvitePayload {
    type: number;
    code: string;
    guild: {
        id: string;
        name: string;
        icon: string | null;
        ownerId: string;
        features: string[];
    };
    channel: {
        id: string;
        name: string;
        type: number;
        description: string | null;
    };
    uses: number;
    maxUses: number;
    expiresAt: string | null;
}