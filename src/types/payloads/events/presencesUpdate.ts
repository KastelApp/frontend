export interface PresencesUpdatePayload {
	user: User;
	hubId: string;
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
	status: "online" | "offline" | "idle" | "dnd" | "invisible";
	since: number;
	current: boolean;
}
