import { atom } from "recoil";
import type User from "$/Client/Structures/User.ts";
import { Settings } from "../types/payloads/ready.ts";
import type BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import type Member from "$/Client/Structures/Guild/Member.ts";
import type Role from "$/Client/Structures/Guild/Role.ts";
import type Guild from "$/Client/Structures/Guild/Guild.ts";

export const channelStore = atom<BaseChannel[]>({
    key: "channels",
    default: [],
    dangerouslyAllowMutability: true
});

export const guildStore = atom<Guild[]>({
    key: "guilds",
    default: [],
    dangerouslyAllowMutability: true
});

export const roleStore = atom<Role[]>({
    key: "roles",
    default: [],
    dangerouslyAllowMutability: true
});

export const memberStore = atom<Member[]>({
    key: "members",
    default: [],
    dangerouslyAllowMutability: true
});

export const inviteStore = atom({
    key: "invites",
    default: [],
    dangerouslyAllowMutability: true
});

export const userStore = atom<User<true | false>[]>({
    key: "users",
    default: [],
    dangerouslyAllowMutability: true
});

export const settingsStore = atom<Settings>({
    default: {
        language: "en-US",
        privacy: 0,
        theme: "dark",
        guildOrder: []
    },
    key: "settings",
    dangerouslyAllowMutability: true
});

export const messageStore = atom<{
    user: {
        globalNickname: string;
        avatar: string;
        presence: string;
        username: string;
        discriminator: string;
    };
    content: string;
    time: string;
    id: string;
    state: "sent" | "sending" | "failed";
    edited: boolean;
}[]>({
    default: [],
    key: "messages",
    dangerouslyAllowMutability: true
});