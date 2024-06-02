import { Theme, EmojiPack, NavBarLocation } from "@/types/payloads/ready.ts";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createTrackedSelector } from "react-tracked";
import Translation, { MetaData } from "@/utils/Translation.ts";

interface SettingsStore {
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

export const useSettingsStore = createTrackedSelector(
	create<SettingsStore>((set) => ({
		emojiPack: EmojiPack.Twemoji,
		language: "en-US",
		navBarLocation: NavBarLocation.Left,
		guildOrder: [],
		privacy: 0,
		theme: Theme.Dark,
		isSideBarOpen: true,
		setEmojiPack: (emojiPack: EmojiPack) => set({ emojiPack }),
		setLanguage: (language: string) => set({ language }),
		setNavBarLocation: (navBarLocation: NavBarLocation) => set({ navBarLocation }),
		setGuildOrder: (
			guildOrder: {
				guildId: string;
				position: number;
			}[],
		) => set({ guildOrder }),
		setPrivacy: (privacy: number) => set({ privacy }),
		setTheme: (theme: Theme) => set({ theme }),
		setIsSideBarOpen: (isSideBarOpen: boolean) => set({ isSideBarOpen }),
	})),
);

interface GuildSettings {
	memberBarHidden: boolean;
}

interface GuildSettingsStore {
	guildSettings: Record<string, GuildSettings>;
	setGuildSettings: (guildId: string, guildSettings: GuildSettings) => void;
}

export const useGuildSettingsStore = createTrackedSelector(
	create(
		persist<GuildSettingsStore>(
			(set) => ({
				guildSettings: {},
				setGuildSettings: (guildId: string, guildSettings: GuildSettings) =>
					set((state) => ({
						guildSettings: {
							...state.guildSettings,
							[guildId]: guildSettings,
						},
					})),
			}),
			{
				name: "guild-settings",
			},
		),
	),
);

interface SelectedTabStore {
	selectedTab: string | null;
	setSelectedTab: (selectedTab: string | null) => void;
}

export const useSelectedTab = createTrackedSelector(
	create<SelectedTabStore>((set) => ({
		selectedTab: null,
		setSelectedTab: (selectedTab: string | null) => set({ selectedTab }),
	})),
);

interface TranslationStore {
	rawTranslation: Translation;
	setLanguage: (language: string) => void;
	t: (key: string, ...anything: never[]) => string;
	fetchLanguages: () => MetaData["languages"];
	currentLanguage: string;
	_hasHydrated: boolean;
	setHasHydrated: (hasHydrated: boolean) => void;
}

export const useTranslationStore = createTrackedSelector(
	create(
		persist<TranslationStore>(
			(set, get) => ({
				rawTranslation: new Translation(),
				currentLanguage: "en",
				_hasHydrated: false,
				setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
				setLanguage: async (language: string) => {
					await get().rawTranslation.fetchTranslation(language);
					set({ currentLanguage: language });
				},
				t: (key: string, ...anything: never[]) => get().rawTranslation.t(get().currentLanguage, key, ...anything),
				fetchLanguages: () => get().rawTranslation.metaData.languages,
			}),
			{
				name: "translation",
				partialize: (state) =>
					Object.fromEntries(
						Object.entries(state).filter(([key]) => key === "currentLanguage"),
					) as unknown as TranslationStore,
				onRehydrateStorage: () => async (state) => {
					await state?.rawTranslation.fetchMetaData();

					await state?.rawTranslation.fetchTranslation(state?.currentLanguage);

					state!.setHasHydrated(true);
				},
			},
		),
	),
);