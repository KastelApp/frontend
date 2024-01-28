import { atom } from "recoil";

export const channelStore = atom({
    key: "channels",
    default: [],
    dangerouslyAllowMutability: true
});

export const guildStore = atom({
    key: "guilds",
    default: [],
    dangerouslyAllowMutability: true
});

export const roleStore = atom({
    key: "roles",
    default: [],
    dangerouslyAllowMutability: true
});

export const memberStore = atom({
    key: "members",
    default: [],
    dangerouslyAllowMutability: true
});

export const inviteStore = atom({
    key: "invites",
    default: [],
    dangerouslyAllowMutability: true
});

export const userStore = atom({
    key: "users",
    default: [],
    dangerouslyAllowMutability: true
});