export interface CreateGuildOptions {
	description?: string | null;
	channels?: {
		id?: string;
		description?: string | null;
		parentId?: string | null;
		permissionOverrides?: {
			[x: string]: {
				allow?: [string, string][];
				deny?: [string, string][];
				slowmode?: number;
				type: number;
			};
		};
		slowmode?: number;
		ageRestricted?: boolean;
		position?: number;
		name: string;
		type: number;
	}[];
	roles?: {
		id?: string;
		color?: number;
		permissions?: [string, string][];
		hoist?: boolean;
		everyone?: boolean;
		allowedAgeRestricted?: boolean;
		name: string;
		position: number;
	}[];
	template?: string;
	name: string;
	features: ("Partnered" | "Verified" | "Official" | "Maintenance" | "InternalStaffGuild")[];
	id?: string;
}
