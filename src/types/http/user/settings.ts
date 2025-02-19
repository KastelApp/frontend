export interface UpdateSettingsOptions {
	customStatus?: string | null;
	theme?: "dark" | "light" | "system";
	language?: string;
	hubOrder?: {
		hubId: string;
		position: number;
	}[];
	bio?: string;
	navBarLocation?: "bottom" | "left";
	emojiPack?: "twemoji" | "noto-emoji" | "fluentui-emoji" | "native";
}

export interface SettingsPayload {
	bio: string | null;
	hubOrder: {
		hubId: string;
		position: number;
	}[];
	language: "en-US";
	privacy: number;
	status: number;
	theme: "dark" | "light" | "system";
	allowedInvites: number;
	customStatus: string | null;
	navBarLocation: "bottom" | "left";
	emojiPack: "twemoji" | "noto-emoji" | "fluentui-emoji" | "native";
}
