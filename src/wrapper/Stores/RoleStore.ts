import { create } from "zustand";

export interface Role {
	allowedAgeRestricted: boolean;
	color: number;
	hoisted: boolean;
	id: string;
	hubId: string;
	permissions: [string, string][];
	position: number;
	name: string;
}

export interface RoleStore {
	roles: Role[];
	addRole(role: Role): void;
	removeRole(id: string): void;
	getRole(id: string): Role | undefined;
	getRoles(hubId: string): Role[];
}

export const useRoleStore = create<RoleStore>((set, get) => ({
	roles: [],
	addRole: (role) => {
		const currentRoles = get().roles;

		const foundRole = currentRoles.find((currentRole) => currentRole.id === role.id) ?? {};

		set({
			roles: [
				...currentRoles.filter((currentRole) => currentRole.id !== role.id),
				{
					...foundRole,
					...role,
				},
			],
		});
	},
	removeRole: (id) => set({ roles: get().roles.filter((role) => role.id !== id) }),
	getRole: (id) => get().roles.find((role) => role.id === id),
	getRoles: (hubId) => get().roles.filter((role) => role.hubId === hubId),
}));
