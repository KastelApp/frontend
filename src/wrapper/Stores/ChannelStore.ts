import { create } from "zustand";
import { useAPIStore } from "../Stores.ts";
import { useUserStore } from "./UserStore.ts";
import { useMemberStore } from "./Members.ts";
import { useRoleStore } from "./RoleStore.ts";
import PermissionHandler from "../PermissionHandler.ts";
import Logger from "@/utils/Logger.ts";
import { channelTypes } from "@/utils/Constants.ts";
import { persist } from "zustand/middleware";

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
    permissionOverrides: PermissionOverrides;
    position: number;
    lastMessageId: string | null;
}

export interface CustomChannel extends Channel {
    channels: Channel[];
}

export interface ChannelStore {
    channels: Channel[];
    addChannel(channel: Channel): void;
    removeChannel(id: string): void;
    getChannel(id: string): Promise<Channel | undefined>;
    getChannels(guildId: string): Channel[];
    getChannelsWithValidPermissions(guildId: string): Channel[];
    getTopChannel(guildId: string): Channel | undefined;
    getSortedChannels(guildId: string, permissionCheck?: boolean): CustomChannel[];
    sendTyping(guildId: string, channelId: string): void;
}

export interface PerChannel {
    /**
     * The content of the message you are currently typing
     */
    previousMessageContent: string | null;
    /**
     * default - The user is not editing or replying to a message
     * editing - The user is editing a message
     * replying - The user is replying to a message
     * jumped - The user has jumped to a message (after a few seconds this defaults to default)
     */
    currentState: "default" | "editing" | "replying" | "jumped";
    /**
     * The message id of the message you are replying to or editing
     */
    stateId: string | null;
    /**
     * The position of the scroll bar, used for switching channels and staying at the same position
     */
    scrollPosition: number;
    /**
     * The last time the user typed
     */
    lastTyped: number;
    /**
     * The date the last typing event was sent
     */
    lastTypingSent: number;
    /**
     * If there's more messages before (i.e on the top)
     */
    hasMoreBefore: boolean;
    /**
     * If there's more messages after (i.e on the bottom)
     */
    hasMoreAfter: boolean;
    /**
     * If something went wrong fetching the messages
     */
    fetchingError: boolean;
}

export interface PerChannelStore {
    channels: {
        [key: string]: PerChannel;
    };
    getChannel(channelId: string): PerChannel;
    addChannel(channelId: string): void;
    removeChannel(channelId: string): void;
    updateChannel(channelId: string, data: Partial<PerChannel>): void;
}

export const useChannelStore = create<ChannelStore>((set, get) => ({
    channels: [],
    addChannel: (channel) => {
        const currentChannels = get().channels;

        const foundChannel = currentChannels.find((currentChannel) => currentChannel.id === channel.id) ?? { id: null };

        set({
            channels: [
                ...currentChannels.filter(channel => channel.id !== foundChannel?.id),
                {
                    ...foundChannel,
                    ...channel
                }
            ]
        });
    },
    removeChannel: (id) => set({ channels: get().channels.filter(channel => channel.id !== id) }),
    getChannel: async (id) => {
        const channel = get().channels.find(channel => channel.id === id);

        if (channel) return channel;

        const api = useAPIStore.getState().api;

        if (!api) return;

        console.log("FETCH", api);
    },
    getChannels: (guildId) => get().channels.filter(channel => channel.guildId === guildId),
    getChannelsWithValidPermissions: (guildId) => {
        const clientUser = useUserStore.getState().getCurrentUser();

        if (!clientUser) {
            Logger.warn("No client user found", "ChannelStore | getChannelsWithValidPermissions");

            return [];
        }

        const guildMember = useMemberStore.getState().getMember(guildId, clientUser.id);
        const roles = useRoleStore.getState().getRoles(guildId);
        const channels = get().channels.filter(channel => channel.guildId === guildId);

        if (!guildMember || !roles) {
            Logger.warn("No guild member or roles found", "ChannelStore | getChannelsWithValidPermissions");

            return [];
        }

        const permissionHandler = new PermissionHandler(
            clientUser.id,
            guildMember.owner,
            guildMember.roles.map(roleId => roles.find(role => role.id === roleId)!).filter(Boolean),
            channels
        );

        return channels.filter((channel) => permissionHandler.hasChannelPermission(channel.id, ["ViewMessageHistory"]));
    },
    getTopChannel: (guildId) => {
        const channels = get().getChannelsWithValidPermissions(guildId);

        const topChannel = channels.filter((channel) => [
            channelTypes.GuildMarkdown,
            channelTypes.GuildNewMember,
            channelTypes.GuildNews,
            channelTypes.GuildRules,
            channelTypes.GuildText
        ].includes(channel.type)).sort((a, b) => a.position - b.position)[0];

        return topChannel;
    },
    getSortedChannels: (guildId, permissionCheck) => {
        const baseChannels = permissionCheck ? get().getChannelsWithValidPermissions(guildId) : get().getChannels(guildId);

        const rawSortedChannels: CustomChannel[] = [];

        const parentlessChannels = baseChannels.filter(channel => !channel.parentId && channel.type !== channelTypes.GuildCategory);

        for (const channel of parentlessChannels) {
            rawSortedChannels.push({
                ...channel,
                channels: []
            });
        }

        const categoryChannels = baseChannels.filter(channel => channel.type === channelTypes.GuildCategory);

        for (const category of categoryChannels) {
            const categoryChannels = baseChannels.filter(channel => channel.parentId === category.id);

            rawSortedChannels.push({
                ...category,
                channels: categoryChannels.sort((a, b) => a.position - b.position)
            });
        }

        const parentsOnly = rawSortedChannels.filter(channel => channel.type === channelTypes.GuildCategory).sort((a, b) => a.position - b.position);

        const sortedParentlessChannels = rawSortedChannels.filter(channel => !channel.parentId && channel.type !== channelTypes.GuildCategory).sort((a, b) => a.position - b.position);

        return [
            ...sortedParentlessChannels,
            ...parentsOnly
        ];
    },
    sendTyping: (guildId, channelId) => {
        // ? We use `getChannelsWithValidPermissions` just so we don't have to check permissions our self
        // ? Since if the channel does not exist we don't even make a API call
        const channel = get().getChannelsWithValidPermissions(guildId).find(channel => channel.id === channelId);

        if (!channel) return;

        const perChannel = usePerChannelStore.getState().getChannel(channelId);

        if (Date.now() - perChannel.lastTypingSent < 5000) return;

        useAPIStore.getState().api.post(`/channels/${channelId}/typing`).catch(console.error);

        usePerChannelStore.getState().updateChannel(channelId, { lastTypingSent: Date.now() });
    }
}));

export const usePerChannelStore = create(
    persist<PerChannelStore>(
        (set, get) => ({
            channels: {},
            getChannel: (channelId) => {
                const found = get().channels[channelId] ?? {
                    currentState: "default",
                    lastTyped: 0,
                    lastTypingSent: 0,
                    previousMessageContent: null,
                    scrollPosition: 0,
                    stateId: null
                };

                return found;
            },
            addChannel: (channelId) => set({
                channels: {
                    ...get().channels, [channelId]:
                    {
                        previousMessageContent: null,
                        currentState: "default",
                        stateId: null,
                        scrollPosition: 0,
                        lastTyped: 0,
                        lastTypingSent: 0,
                        fetchingError: false,
                        hasMoreAfter: true,
                        hasMoreBefore: true
                    }
                }
            }),
            removeChannel: (channelId) => {
                const channels = get().channels;

                delete channels[channelId];

                set({ channels });
            },
            updateChannel: (channelId, data) => {
                const channel = get().channels[channelId] ?? {
                    currentState: "default",
                    lastTyped: 0,
                    lastTypingSent: 0,
                    previousMessageContent: null,
                    scrollPosition: 0,
                    stateId: null
                };

                set({ channels: { ...get().channels, [channelId]: { ...channel, ...data } } });
            }
        }),
        {
            name: "perChannelStore",
            partialize: (state) => {
                return {
                    channels: Object.fromEntries(
                        Object.entries(state.channels).map(([key, value]) => [key, { previousMessageContent: value.previousMessageContent }])
                    )
                } as unknown as PerChannelStore;
            },
        }
    )
);