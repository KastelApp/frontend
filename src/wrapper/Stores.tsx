import { Theme, EmojiPack, NavBarLocation } from "@/types/payloads/ready.ts";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Translation from "@/utils/Translation.ts";
import {
	APIStore,
	ClientStore,
	HubSettings,
	HubSettingsStore,
	IsReadyStore,
	StoredSettings,
	SelectedTabStore,
	SettingsStore,
	TokenStore,
	TranslationKeys,
	TranslationStore,
} from "./Stores.types.ts";
import API from "./API.ts";
import Client from "./Client.ts";
import MessageMarkDown from "@/components/Message/Markdown/MarkDown.tsx";
import { ReactEditor } from "slate-react";

// todo: migrate this to @wrapper/Stores
export const useSettingsStore = create<SettingsStore>((set) => ({
	emojiPack: EmojiPack.Twemoji,
	language: "en-US",
	navBarLocation: NavBarLocation.Bottom,
	hubOrder: [],
	privacy: 0,
	theme: Theme.Dark,
	isSideBarOpen: true,
	setEmojiPack: (emojiPack: EmojiPack) => set({ emojiPack }),
	setLanguage: (language: string) => set({ language }),
	setNavBarLocation: (navBarLocation: NavBarLocation) => set({ navBarLocation }),
	setHubOrder: (
		hubOrder: {
			hubId: string;
			position: number;
		}[],
	) => set({ hubOrder }),
	setPrivacy: (privacy: number) => set({ privacy }),
	setTheme: (theme: Theme) => set({ theme }),
	setIsSideBarOpen: (isSideBarOpen: boolean) => set({ isSideBarOpen }),
}));

export const useHubSettingsStore = create(
	persist<HubSettingsStore>(
		(set, get) => ({
			hubSettings: [],
			setHubSettings: (hubId: string, hubSettings: Partial<Omit<HubSettings, "hubId">>) => {
				const currentHubSettings = get().hubSettings;
				const foundHub = currentHubSettings.find((hub) => hub.hubId === hubId) ?? {
					hubId,
					memberBarHidden: false,
					lastChannelId: null,
				};

				set({
					hubSettings: [
						...currentHubSettings.filter((hub) => hub.hubId !== hubId),
						{
							...foundHub,
							...hubSettings,
						}
					]
				})
			},
			getHubSettings: (hubId: string) => {
				if (!Array.isArray(get().hubSettings)) {
					set({ hubSettings: [] });
					
					return undefined;
				}

				return get().hubSettings.find((hub) => hub.hubId === hubId);
			},
		}),
		{
			name: "hub-settings",
		},
	),
);

export const useSelectedTab = create<SelectedTabStore>((set) => ({
	selectedTab: "friends",
	setSelectedTab: (selectedTab: string | null) => set({ selectedTab }),
}));

// ? The reason we don't use "createTrackedSelector" here is we still want to update components when something like the current language changes, without requiring it in the component
// ? There's a few other things we want to do that as well (i.e settings etc)
export const useTranslationStore = create(
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
			t: (key: TranslationKeys, ...anything: unknown[]) =>
				get().rawTranslation.t(get().currentLanguage, key, ...anything),
			markdownT: (key: TranslationKeys, ...anything: unknown[]) => {
				const value = get().t(key, anything);

				return (
					<span className="overflow-hidden whitespace-pre-wrap break-words">
						<MessageMarkDown>{value}</MessageMarkDown>
					</span>
				);
			},
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

export const useAPIStore = create<APIStore>((set) => ({
	api: new API(null),
	setAPI: (api: API) => set({ api }),
}));

export const useTokenStore = create(
	persist<TokenStore>(
		(set) => ({
			token: null,
			setToken: (token: string | null) => set({ token }),
		}),
		{
			name: "token",
		},
	),
);

export const useIsReady = create<IsReadyStore>((set) => ({
	isReady: false,
	setIsReady: (isReady: boolean) => set({ isReady }),
}));

export const useClientStore = create<ClientStore>((set) => ({
	client: new Client(),
	setClient: (client: Client) => set({ client }),
}));

export const useStoredSettingsStore = create(
	persist<StoredSettings>(
		(set) => ({
			isChannelsOpen: false,
			isMobile: false,
			isDmsOpen: false,
			isHubsOpen: false,
			isMembersOpen: false,
			navbarPosition: 0,
			mobilePopupIgnored: false,
			setMobilePopupIgnored: (mobilePopupIgnored: boolean) => set({ mobilePopupIgnored }),
			setIsMobile: (isMobile: boolean) => set({ isMobile }),
			setIsChannelsOpen: (isChannelsOpen: boolean) => set({ isChannelsOpen }),
			setIsDmsOpen: (isDmsOpen: boolean) => set({ isDmsOpen }),
			setIsHubsOpen: (isHubsOpen: boolean) => set({ isHubsOpen }),
			setIsMembersOpen: (isMembersOpen: boolean) => set({ isMembersOpen }),
			setNavbarPosition: (navbarPosition: number) => set({ navbarPosition }),
		}),
		{
			name: "stored-settings",
		},
	),
);

export interface EditorStore {
	editor: ReactEditor | null;
	setEditor: (editor: ReactEditor) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
	editor: null,
	setEditor: (editor) => set({ editor }),
}));
