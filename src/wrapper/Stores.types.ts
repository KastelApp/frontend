import type { Theme, EmojiPack, NavBarLocation } from "@/types/payloads/ready.ts";
import type Translation from "@/utils/Translation.ts";
import type { MetaData } from "@/utils/Translation.ts";
import API from "./API.ts";
import Client from "./Client.ts";
import type enTranslations from "@/../public/locales/en.json";

type ExcludeKeys<T, K extends keyof T> = {
	[P in keyof T as P extends K ? never : P]: T[P];
};

type DataWithoutMetaAndDebug = ExcludeKeys<typeof enTranslations, "_meta" | "_debug">;

type NestedPaths<T, P extends string = ""> = T extends object
	? {
			[K in keyof T]: T[K] extends object
				? // @ts-expect-error -- We do not care, its valid
					NestedPaths<T[K], `${P}${K}.`>
				: // @ts-expect-error -- We do not care, its valid
					`${P}${K}`;
		}[keyof T]
	: P;

export type TranslationKeys = NestedPaths<DataWithoutMetaAndDebug>;

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

export interface StoredSettingsStore {
	mobilePopupIgnored: boolean;
	setMobilePopupIgnored: (mobilePopupIgnored: boolean) => void;
}

export interface GuildSettings {
	memberBarHidden: boolean;
	lastChannelId: string | null;
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
	t: (key: TranslationKeys, ...anything: unknown[]) => string;
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
