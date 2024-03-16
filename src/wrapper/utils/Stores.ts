import type User from "$/Client/Structures/User/User.ts";
import { Settings } from "../types/payloads/ready.ts";
import type BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import type Member from "$/Client/Structures/Guild/Member.ts";
import type Role from "$/Client/Structures/Guild/Role.ts";
import type Guild from "$/Client/Structures/Guild/Guild.ts";
import Message from "$/Client/Structures/Message.ts";
import { create } from "zustand";

interface Versioning {
    version: number;
    setVersion: (version: number) => void;
}

interface RoleStore extends Versioning {
    roles: Role[];
    setRoles: (roles: Role[]) => void;
    addRole: (role: Role) => void;
    addRoles: (roles: Role[]) => void;
    removeRole: (role: Role) => void;
    getCurrentRoles: () => Role[];
}

export const useRoleStore = create<RoleStore>((set, get) => ({
    roles: [] as Role[],
    setRoles: (roles: Role[]) => set({ roles }),
    addRole: (role: Role) => set((state) => ({ roles: [...state.roles, role] })),
    addRoles: (roles: Role[]) => set((state) => ({ roles: [...state.roles, ...roles] })),
    removeRole: (role: Role) => set((state) => ({ roles: state.roles.filter((r) => r.id !== role.id) })),
    getCurrentRoles: () => {
        if (!("window" in globalThis)) return [];

        const match = globalThis.window.location.pathname.match(/guilds\/(\d+)/);

        if (!match) return [];

        return get().roles.filter((r) => r.guildId === match[1]);
    },
    version: 0,
    setVersion: (version: number) => set(() => ({ version }))
}));


interface InviteStore extends Versioning {
    invites: string[];
    setInvites: (invites: string[]) => void;
    addInvite: (invite: string) => void;
    removeInvite: (invite: string) => void;
}

export const useInviteStore = create<InviteStore>((set) => ({
    invites: [] as string[],
    setInvites: (invites: string[]) => set({ invites }),
    addInvite: (invite: string) => set((state) => ({ invites: [...state.invites, invite] })),
    removeInvite: (invite: string) => set((state) => ({ invites: state.invites.filter((i) => i !== invite) })),
    version: 0,
    setVersion: (version: number) => set(() => ({ version }))
}));

interface UserStore extends Versioning {
    users: User<boolean>[];
    setUsers: (users: User<boolean>[]) => void;
    addUser: (user: User<boolean>) => void;
    removeUser: (user: User<boolean>) => void;
    getCurrentUser: () => User<true> | null;
}

export const useUserStore = create<UserStore>((set, get) => ({
    users: [] as User<boolean>[],
    setUsers: (users: User<boolean>[]) => set({ users: users }),
    addUser: (user: User<boolean>) => set((state) => ({ users: [...state.users, user] })),
    removeUser: (user: User<boolean>) => set((state) => ({ users: state.users.filter((u) => u.id !== user.id) })),
    getCurrentUser: () => {
        return get().users.find((u) => u.isClient) as User<true> | null ?? null;
    },
    version: 0,
    setVersion: (version: number) => set(() => ({ version }))
}));


interface MemberStore extends Versioning {
    members: Member[];
    setMembers: (members: Member[]) => void;
    addMember: (member: Member) => void;
    removeMember: (member: Member) => void;
    getMember: (guildId: string) => Member[];
    getCurrentMember: () => Member | null;
    getCurrentMembers: () => Member[];
}

export const useMemberStore = create<MemberStore>((set, get) => ({
    members: [] as Member[],
    setMembers: (members: Member[]) => set({ members }),
    addMember: (member: Member) => set((state) => ({ members: [...state.members, member] })),
    removeMember: (member: Member) => set((state) => ({ members: state.members.filter((m) => m.userId !== member.userId) })),
    getMember: (guildId: string) => {
        return get().members.filter((m) => m.guildId === guildId);
    },
    getCurrentMember: () => {
        if (!("window" in globalThis)) return null;

        const match = globalThis.window.location.pathname.match(/guilds\/(\d+)/);

        if (!match) return null;

        const user = useUserStore.getState().getCurrentUser();

        if (!user) return null;

        return get().members.find((m) => m.userId === user.id && m.guildId === match[1]) ?? null;
    },
    getCurrentMembers: () => {
        if (!("window" in globalThis)) return [];

        const match = globalThis.window.location.pathname.match(/guilds\/(\d+)/);

        if (!match) return [];

        return get().members.filter((m) => m.guildId === match[1]);
    },
    version: 0,
    setVersion: (version: number) => set(() => ({ version }))
}));


interface SettingsStore extends Versioning {
    settings: Settings;
    setSettings: (settings: Settings) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    settings: {
        language: "en-US",
        privacy: 0,
        theme: "dark",
        guildOrder: [],
        navBarLocation: "bottom",
        emojiPack: "twemoji"
    },
    setSettings: (settings: Settings) => set({ settings }),
    version: 0,
    setVersion: (version: number) => set(() => ({ version }))
}));

interface MessageStore extends Versioning {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    removeMessage: (message: Message) => void;
    getMessagesFromChannel: (channelId: string) => Message[];
    getAuthor: (messageId: string) => User<boolean> | null;
    getMember: (messageId: string) => Member | null;
    getCurrentMessages: () => Message[];
}

export const useMessageStore = create<MessageStore>((set, get) => ({
    messages: [] as Message[],
    setMessages: (messages: Message[]) => set({ messages }),
    addMessage: (message: Message) => set((state) => ({
        messages: [message, ...state.messages.filter((m) => m.id !== message.id)]
    })),
    removeMessage: (message: Message) => set((state) => ({ messages: state.messages.filter((m) => m.id !== message.id) })),
    getMessagesFromChannel: (channelId: string) => {
        return get().messages.filter((m) => m.channelId === channelId);
    },
    getAuthor: (messageId: string) => {
        const message = get().messages.find((m) => m.id === messageId);

        if (!message) return null;

        return useUserStore.getState().users.find((u) => u.id === message.authorId) ?? null;
    },
    getMember: (messageId: string) => {
        const message = get().messages.find((m) => m.id === messageId);

        if (!message) return null;

        return useMemberStore.getState().members.find((m) => m.userId === message.authorId) ?? null;
    },
    getCurrentMessages: () => {
        if (!("window" in globalThis)) return [];

        const match = globalThis.window.location.pathname.match(/channels\/(\d+)/);

        if (!match) return [];

        return get().messages.filter((m) => m.channelId === match[1]);
    },
    version: 0,
    setVersion: (version: number) => set(() => ({ version }))
}));

interface ChannelStore extends Versioning {
    channels: BaseChannel[];
    setChannels: (channels: BaseChannel[]) => void;
    addChannel: (channel: BaseChannel) => void;
    addChannels: (channels: BaseChannel[]) => void;
    removeChannel: (channel: BaseChannel) => void;
    /**
     * This depends on the current route, i.e /app/guilds/:id/channels/:id we use the regex `/channels\/(\d+)/` to get the channel id
     */
    getCurrentChannel: () => BaseChannel | null;
    getChannelFromMessage: (messageId: string) => BaseChannel | null;
    getCurrentChannels: () => BaseChannel[];
}

export const useChannelStore = create<ChannelStore>((set, get) => ({
    channels: [] as BaseChannel[],
    setChannels: (channels: BaseChannel[]) => set({ channels }),
    addChannel: (channel: BaseChannel) => set((state) => ({ channels: [...state.channels, channel] })),
    addChannels: (channels: BaseChannel[]) => set((state) => ({ channels: [...state.channels, ...channels] })),
    removeChannel: (channel: BaseChannel) => set((state) => ({ channels: state.channels.filter((c) => c.id !== channel.id) })),
    getCurrentChannel: () => {
        if (!("window" in globalThis)) return null;

        const match = globalThis.window.location.pathname.match(/channels\/(\d+)/);

        if (!match) return null;

        return get().channels.find((c) => c.id === match[1]) ?? null;
    },
    getChannelFromMessage: (messageId: string) => {
        const message = useMessageStore.getState().messages.find((m) => m.id === messageId);

        if (!message) return null;

        return get().channels.find((c) => c.id === message.channelId) ?? null;
    },
    getCurrentChannels: () => {
        if (!("window" in globalThis)) return [];

        const match = globalThis.window.location.pathname.match(/guilds\/(\d+)/);

        if (!match) return [];

        return get().channels.filter((c) => c.guildId === match[1]);
    },
    version: 0,
    setVersion: (version: number) => set(() => ({ version }))
}));


interface GuildStore extends Versioning {
    guilds: Guild[];
    setGuilds: (guilds: Guild[]) => void;
    addGuild: (guild: Guild) => void;
    removeGuild: (guild: Guild) => void;
    /**
     * This depends on the current route, i.e /app/guilds/:id we use the regex `/guilds\/(\d+)/` to get the guild id
     */
    getCurrentGuild(): Guild | null;
}

export const useGuildStore = create<GuildStore>((set, get) => ({
    guilds: [] as Guild[],
    setGuilds: (guilds: Guild[]) => set({ guilds }),
    addGuild: (guild: Guild) => set((state) => ({ guilds: [...state.guilds, guild] })),
    removeGuild: (guild: Guild) => set((state) => ({ guilds: state.guilds.filter((g) => g.id !== guild.id) })),
    getCurrentGuild: () => {
        if (!("window" in globalThis)) return null;

        const match = globalThis.window.location.pathname.match(/guilds\/(\d+)/);

        if (!match) return null;

        return get().guilds.find((g) => g.id === match[1]) ?? null;
    },
    version: 0,
    setVersion: (version: number) => set(() => ({ version }))
}));

interface ChannelStoresWithNoMessages extends Versioning {
    channels: string[];
    setChannels: (channels: string[]) => void;
    addChannel: (channel: string) => void;
}

export const useChannelStoreWithNoMessages = create<ChannelStoresWithNoMessages>((set) => ({
    channels: [],
    setChannels: (channels: string[]) => set({ channels }),
    addChannel: (channel: string) => set((state) => ({ channels: [...state.channels, channel] })),
    version: 0,
    setVersion: (version: number) => set(() => ({ version }))
}));

interface MessageStateStore extends Versioning {
    messageId: string | null;
    state: "editing" | "replying" | "idle"
    setMessageId: (messageId: string | null) => void;
    setState: (state: "editing" | "replying" | "idle") => void;
}

export const useMessageStateStore = create<MessageStateStore>((set) => ({
    messageId: null,
    state: "idle",
    setState: (state: "editing" | "replying" | "idle") => set({ state }),
    setMessageId: (messageId: string | null) => set({ messageId: messageId }),
    version: 0,
    setVersion: (version: number) => set(() => ({ version }))
}));

interface TypingStore extends Versioning {
    typing: {
        [channelId: string]: { 
            userId: string;
            since: number;
        }[]
    };
    addTyping: (channelId: string, userId: string, since: number) => void;
    removeTyping: (channelId: string, userId: string) => void;
}

export const useTypingStore = create<TypingStore>((set, get) => ({
    version: 0,
    setVersion: (version: number) => set(() => ({ version })),
    typing: {},
    addTyping: (channelId: string, userId: string, since: number) => {
        return set(() => {
            const typing = get().typing[channelId] ?? [];

            // if userid already exists, update the since
            if (typing.some((t) => t.userId === userId)) {
                return {
                    typing: {
                        ...get().typing,
                        [channelId]: typing.map((t) => t.userId === userId ? { userId, since } : t)
                    }
                }
            }

            return {
                typing: {
                    ...get().typing,
                    [channelId]: [...typing, { userId, since }]
                }
            }
        })
    },
    removeTyping: (channelId: string, userId: string) => {
        return set(() => {
            const typing = get().typing[channelId] ?? [];

            return {
                typing: {
                    ...get().typing,
                    [channelId]: typing.filter((t) => t.userId !== userId)
                }
            }
        })
    }
}));