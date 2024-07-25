import { create } from "zustand";
import { useAPIStore } from "../Stores.ts";

// ? We do not provide channels, roles or members as they got their own stores
export interface Guild {
    name: string;
    description: string | null;
    features: string[];
    id: string;
    icon: string | null;
    ownerId: string | null;
    coOwners: string[];
    maxMembers: number;
    flags: number;
    unavailable: boolean;
    channelProperties: {
        channelId: string;
        lastMessageAckId: string | null;
        timedoutUntil: string | null;
    }[];
    memberCount: number
}

export interface GuildStore {
    guilds: Guild[];
    addGuild(guild: Partial<Guild>): void;
    removeGuild(id: string): void;
    // ? This isn't a promise due to the fact that we have no reason to fetch a guild via the api
    getGuild(id: string): Guild | undefined;
    updateReadState(guildId: string, channelId: string, lastMessageAckId: string): void;
}

export const useGuildStore = create<GuildStore>((set, get) => ({
    guilds: [],
    addGuild: (guild) => {
        const currentGuilds = get().guilds;
        let guildUpdated = false;
    
        const updatedGuilds = currentGuilds.map((currentGuild) => {
            if (currentGuild.id === guild.id) {
                guildUpdated = true;
                return { ...currentGuild, ...guild } as Guild;
            }
            return currentGuild;
        });
    
        if (!guildUpdated) {
            updatedGuilds.push(guild as Guild);
        }
    
        set({
            guilds: updatedGuilds,
        });
    },
    removeGuild: (id) => set({ guilds: get().guilds.filter(guild => guild.id !== id) }),
    getGuild: (id) => get().guilds.find(guild => guild.id === id) ?? {
        name: "Unknown",
        description: null,
        features: [],
        id: id,
        icon: null,
        ownerId: null,
        coOwners: [],
        maxMembers: 0,
        flags: 0,
        unavailable: true,
        channelProperties: [],
        memberCount: 0
    },
    updateReadState: async (guildId, channelId, lastMessageAckId) => {
        const guild = get().getGuild(guildId);

        if (!guild) return;

        const channel = guild.channelProperties.find(channel => channel.channelId === channelId);

        if (!channel) return;

        useAPIStore.getState().api.post(`/channels/${channelId}/ack`).catch(console.error);

        set({
            guilds: get().guilds.map((currentGuild) => {
                if (currentGuild.id === guildId) {
                    return {
                        ...currentGuild,
                        channelProperties: currentGuild.channelProperties.map((currentChannel) => {
                            if (currentChannel.channelId === channelId) {
                                return {
                                    ...currentChannel,
                                    lastMessageAckId
                                };
                            }

                            return currentChannel;
                        })
                    };
                }

                return currentGuild;
            })
        });
    }
}));