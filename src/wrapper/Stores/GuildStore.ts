import { create } from "zustand";

// ? We do not provide channels, roles or members as they got their own stores
export interface Guild {
    name: string;
    description: string | null;
    features: string[] | null;
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
    }[]
}

export interface GuildStore {
    guilds: Guild[];
    addGuild(guild: Guild): void;
    removeGuild(id: string): void;
    // ? This isn't a promise due to the fact that we have no reason to fetch a guild via the api
    getGuild(id: string): Guild | undefined;
}

export const useGuildStore = create<GuildStore>((set, get) => ({
    guilds: [],
    addGuild: (guild) => set({ guilds: [...get().guilds, guild] }),
    removeGuild: (id) => set({ guilds: get().guilds.filter(guild => guild.id !== id) }),
    getGuild: (id) => get().guilds.find(guild => guild.id === id),
}));