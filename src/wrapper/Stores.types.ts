import type { Theme, EmojiPack, NavBarLocation } from "@/types/payloads/ready.ts";
import type Translation from "@/utils/Translation.ts";
import type { MetaData } from "@/utils/Translation.ts";
import API from "./API.ts";
import Client from "./Client.ts";

export interface SettingsStore {
	language: string;
	privacy: number;
	theme: Theme;
	guildOrder: {
		guildId: string;
		position: number;
	}[];
	navBarLocation: NavBarLocation;
	emojiPack: EmojiPack;
	isSideBarOpen: boolean;
	setLanguage: (language: string) => void;
	setPrivacy: (privacy: number) => void;
	setTheme: (theme: Theme) => void;
	setGuildOrder: (
		guildOrder: {
			guildId: string;
			position: number;
		}[],
	) => void;
	setNavBarLocation: (navBarLocation: NavBarLocation) => void;
	setEmojiPack: (emojiPack: EmojiPack) => void;
	setIsSideBarOpen: (isSideBarOpen: boolean) => void;
}

export interface GuildSettings {
	memberBarHidden: boolean;
}

export interface GuildSettingsStore {
	guildSettings: Record<string, GuildSettings>;
	setGuildSettings: (guildId: string, guildSettings: GuildSettings) => void;
}

export interface SelectedTabStore {
	selectedTab: string | null;
	setSelectedTab: (selectedTab: string | null) => void;
}

export interface TranslationStore {
	rawTranslation: Translation;
	setLanguage: (language: string) => void;
	t: (key: string, ...anything: never[]) => string;
	fetchLanguages: () => MetaData["languages"];
	currentLanguage: string;
	_hasHydrated: boolean;
	setHasHydrated: (hasHydrated: boolean) => void;
}


export interface APIStore {
	api: API;
	setAPI: (api: API) => void;
}

export interface TokenStore {
	token: string | null;
	setToken: (token: string | null) => void;
}

export interface IsReadyStore {
	isReady: boolean;
	setIsReady: (isReady: boolean) => void;
}

export interface ClientStore {
	client: Client;
	setClient: (client: Client) => void;
}

export interface CurrentStore {
	currentGuildId: string | null;
	currentChannelId: string | null;
	setCurrentGuildId: (guildId: string | null) => void;
	setCurrentChannelId: (channelId: string | null) => void;
}