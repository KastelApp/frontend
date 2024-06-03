import { Theme, EmojiPack, NavBarLocation } from "@/types/payloads/ready.ts";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createTrackedSelector } from "react-tracked";
import Translation from "@/utils/Translation.ts";
import { GuildSettings, GuildSettingsStore, SelectedTabStore, SettingsStore, TranslationStore } from "./Stores.types.ts";

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

export const useSelectedTab = createTrackedSelector(
	create<SelectedTabStore>((set) => ({
		selectedTab: null,
		setSelectedTab: (selectedTab: string | null) => set({ selectedTab }),
	})),
);

// ? The reason we don't use "createTrackedSelector" here is we still want to update components when something like the current language changes, without requiring it in the component
// ? There's a few other things we want to do that as well (i.e settings etc)
export const useTranslationStore =
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
	);