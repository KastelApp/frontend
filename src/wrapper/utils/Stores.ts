import { atom } from "recoil";
import User from "$/Client/Structures/User.ts";
import { Settings } from "../types/payloads/ready.ts";
import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import Member from "$/Client/Structures/Guild/Member.ts";
import Role from "$/Client/Structures/Guild/Role.ts";
import Guild from "$/Client/Structures/Guild/Guild.ts";

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
})