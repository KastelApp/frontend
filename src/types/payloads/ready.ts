export interface ReadyPayload {
	user: UserPayload;
	guilds: Guild[];
	settings: Settings;
	presence: Presence[];
}

export interface UserPayload {
	id: string;
	email: string;
	emailVerified: boolean;
	username: string;
	globalNickname: string | null;
	tag: string;
	avatar: string | null;
	publicFlags: string;
	flags: string;
	phoneNumber: string | null;
	mfaEnabled: boolean;
	mfaVerified: boolean;
	bio: string | null;
}

export interface Guild {
	name: string;
	description: string | null;
	features: string[];
	id: string;
	icon: string | null;
	owner: Owner;
	coOwners: Owner[];
	maxMembers: number;
	flags: number;
	channels: Channel[];
	roles: Role[];
	members: Member[];
	channelProperties: ChannelProperty[];
	unavailable: boolean;
	memberCount: number;
}

export interface Owner {
	avatar: string | null;
	flags: string;
	globalNickname: string | null;
	id: string;
	publicFlags: string;
	tag: string;
	username: string;
}

export interface Channel {
	name: string;
	description: string | null;
	id: string;
	parentId: string | null;
	ageRestricted: boolean;
	slowmode: number;
	type: number;
	children: string[];
	permissionOverrides: PermissionOverrides;
	position: number;
	lastMessageId: string | null;
}

export interface PermissionOverrides {
	[key: string]: PermissionOverride;
}

export interface PermissionOverride {
	allow: [string, string][];
	deny: [string, string][];
	slowmode: number;
	type: number;
}

export interface Role {
	name: string;
	color: number;
	hoist: boolean;
	id: string;
	permissions: [string, string][];
	position: number;
	allowedAgeRestricted: boolean;
}

export interface Member {
	user: MemberUser;
	owner: boolean;
	nickname: string | null;
	roles: string[];
	joinedAt: string;
	presence: Presence[];
}

export interface MemberUser {
	username: string;
	id: string;
	flags: string;
	publicFlags: string;
	avatar: string | null;
	tag: string;
}

export interface Settings {
	language: string;
	privacy: number;
	theme: "dark" | "light" | "system";
	guildOrder: {
		guildId: string;
		position: number;
	}[];
	navBarLocation: "bottom" | "left";
	emojiPack: "twemoji" | "noto-emoji" | "fluentui-emoji" | "native";
}

export enum NavBarLocation {
	Bottom = "bottom",
	Left = "left",
}

export enum EmojiPack {
	Twemoji = "twemoji",
	NotoEmoji = "noto-emoji",
	FluentuiEmoji = "fluentui-emoji",
	Native = "native",
}

export enum Theme {
	Dark = "dark",
	Light = "light",
	System = "system",
}

export interface Presence {
	type: number; // ?  0 = custom, 1 = playing, 2 = watching, 3 = listening, 4 = streaming (2, 3, 4 are not in use yet)
	state: string | null; // ?  If type is 0, this is the custom status, if type is 1, this is the game name, etc etc
	status: "online" | "offline" | "idle" | "dnd" | "invisible";
	since: number | null; // ? how long they've been in this status
	current?: boolean;
}

export interface ChannelProperty {
	channelId: string;
	lastMessageAckId: string | null;
	timedoutUntil: string | null;
}
