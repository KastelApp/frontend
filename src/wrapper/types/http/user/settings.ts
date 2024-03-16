export interface UpdateSettingsOptions  {
    customStatus?: string | null;
    theme?: string;
    language?: string;
    guildOrder?: {
        guildId: string;
        position: number;
    }[];
    bio?: string;
}

export interface SettingsPayload {
	bio: string | null;
	guildOrder: {
        guildId: string;
        position: number;
    }[]
	language: "en-US",
	privacy: number,
	status: number,
	theme: "dark" | "light" | "system",
	allowedInvites: number,
	customStatus: string | null
}