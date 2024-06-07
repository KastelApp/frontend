import { create } from "zustand";
import { useAPIStore } from "../Stores.ts"

export interface PermissionOverrides {
	[key: string]: PermissionOverride;
}

export interface PermissionOverride {
	allow: [string, string][];
	deny: [string, string][];
	slowmode: number;
	type: number;
}

export interface Channel {
    guildId: string;
    name: string;
    description: string | null;
    id: string;
    parentId: string | null;
    ageRestricted: boolean;
    slowmode: number;
    type: number;
    children: string[];
    permissionOverrides: PermissionOverrides
    position: number;
    lastMessageId: string | null;
}

export interface ChannelStore {
    channels: Channel[];
    addChannel(channel: Channel): void;
    removeChannel(id: string): void;
    getChannel(id: string): Promise<Channel | undefined>;
    getChannels(guildId: string): Channel[];
}

export const useChannelStore = create<ChannelStore>((set, get) => ({
    channels: [],
    addChannel: (channel) => {
        const currentChannels = get().channels;

        const foundChannel = currentChannels.find((currentChannel) => currentChannel.id === channel.id) ?? { id: null }

        set({
            channels: [
                ...currentChannels.filter(channel => channel.id !== foundChannel?.id),
                {
                    ...foundChannel,
                    ...channel
                }
            ]
        })
    },
    removeChannel: (id) => set({ channels: get().channels.filter(channel => channel.id !== id) }),
    getChannel: async (id) => {
        const channel = get().channels.find(channel => channel.id === id);

        if (channel) return channel;

        const api = useAPIStore.getState().api;

        if (!api) return;

        console.log("FETCH", api)
    },
    getChannels: (guildId) => get().channels.filter(channel => channel.guildId === guildId) 
}));