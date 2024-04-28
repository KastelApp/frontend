import { Theme, EmojiPack, NavBarLocation } from "@/types/payloads/ready.ts";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createTrackedSelector } from "react-tracked";

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
    setGuildOrder: (guildOrder: {
        guildId: string;
        position: number;
    }[]) => void;
    setNavBarLocation: (navBarLocation: NavBarLocation) => void;
    setEmojiPack: (emojiPack: EmojiPack) => void;
    setIsSideBarOpen: (isSideBarOpen: boolean) => void;
}

export const useSettingsStore = createTrackedSelector(create<SettingsStore>((set) => ({
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
    setGuildOrder: (guildOrder: {
        guildId: string;
        position: number;
    }[]) => set({ guildOrder }),
    setPrivacy: (privacy: number) => set({ privacy }),
    setTheme: (theme: Theme) => set({ theme }),
    setIsSideBarOpen: (isSideBarOpen: boolean) => set({ isSideBarOpen })
})));

interface GuildSettings {
    memberBarHidden: boolean;
}

interface GuildSettingsStore {
    guildSettings: Record<string, GuildSettings>;
    setGuildSettings: (guildId: string, guildSettings: GuildSettings) => void;
}

export const useGuildSettingsStore = createTrackedSelector(create(persist<GuildSettingsStore>((set) => ({
    guildSettings: {},
    setGuildSettings: (guildId: string, guildSettings: GuildSettings) => set((state) => ({
        guildSettings: {
            ...state.guildSettings,
            [guildId]: guildSettings
        }
    }))
}), {
    name: "guild-settings"
})));

interface IsOpenStore {
    values: Record<string, boolean>;
    setOpen: (key: string, value: boolean) => void;
}

export const useIsOpenStore = createTrackedSelector(create<IsOpenStore>((set) => ({
    values: {},
    setOpen: (key: string, value: boolean) => set((state) => ({
        values: value ? {
            ...state.values,
            [key]: value
        } : Object.keys(state.values).reduce((acc, k) => {
            if (k !== key) {
                acc[k] = state.values[k];
            }
            return acc;
        }, {} as Record<string, boolean>)
    }))
})));