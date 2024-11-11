import { create } from "zustand";

export interface Member {
    status: string; // todo: remove
	hubId: string;
	joinedAt: Date;
	nickname: string | null;
	owner: boolean;
	roles: string[];
	userId: string;
	presence: unknown[];
}

export interface MemberStore {
	members: Member[];
	addMember(member: Member): void;
	removeMember(hubId: string, userId: string): void;
	getMember(hubId: string, userId: string): Member | undefined;
	getMembers(hubId: string): Member[];
}

export const useMemberStore = create<MemberStore>((set, get) => ({
	members: [],
	addMember: (member) => {
		const currentMembers = get().members;

		const foundMember =
			currentMembers.find(
				(currentMember) => currentMember.userId === member.userId && currentMember.hubId === member.hubId,
			) ?? {};

		set({
			members: [
				...currentMembers.filter((currentMember) => currentMember.userId !== member.userId || currentMember.hubId !== member.hubId),
				{
					...foundMember,
					...member,
				},
			],
		});
	},
	removeMember: (hubId, userId) =>
		set({ members: get().members.filter((member) => member.userId !== userId && member.hubId !== hubId) }),
	getMember: (hubId, userId) =>
		get().members.find((member) => member.userId === userId && member.hubId === hubId),
	getMembers: (hubId) => get().members.filter((member) => member.hubId === hubId),
}));
