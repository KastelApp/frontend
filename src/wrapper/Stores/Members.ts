import { create } from "zustand";

export interface Member {
    guildId: string;
    joinedAt: Date;
    nickname: string | null;
    owner: boolean;
    roles: string[];
    userId: string;
    presence: unknown[]
}

export interface MemberStore {
    members: Member[];
    addMember(member: Member): void;
    removeMember(userId: string, guildId: string): void;
    getMember(userId: string, guildId: string): Member | undefined;
    getMembers(guildId: string): Member[];
}

export const useMemberStore = create<MemberStore>((set, get) => ({
    members: [],
    addMember: (member) => {
        const currentMembers = get().members;

        const foundMember = currentMembers.find((currentMember) => currentMember.userId === member.userId && currentMember.guildId === member.guildId) ?? {}

        set({
            members: [
                ...currentMembers,
                {
                    ...foundMember,
                    ...member
                }
            ]
        })
    },
    removeMember: (userId, guildId) => set({ members: get().members.filter(member => member.userId !== userId && member.guildId !== guildId) }),
    getMember: (userId, guildId) => get().members.find(member => member.userId === userId && member.guildId === guildId),
    getMembers: (guildId) => get().members.filter(member => member.guildId === guildId)
}));