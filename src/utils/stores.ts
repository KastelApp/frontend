import { atom } from "recoil";
import localStorageEffect from "./effects/localStorage.js";

/**
 * @type {import('@/types/index.d.ts').ReadyState}
 */
export const readyStore = atom({
    key: "ready",
    default: false,
});

/**
 * @type {import('@/types/index.d.ts').ClientToken}
 */
export const tokenStore = atom({
    key: "token",
    default: null,
    effects: [localStorageEffect("token")],
});

/**
 * @type {import('@/types/index.d.ts').ClientAtomType}
 */
export const clientStore = atom({
    key: "client",
    default: null,
    dangerouslyAllowMutability: true,
});

/**
 * @type {import('@/types/index.d.ts').CurrentGuildAtomType}
 */
export const currentGuild = atom({
    key: "currentGuild",
    default: null,
    dangerouslyAllowMutability: true,
});

/**
 * @type {import('@/types/index.d.ts').CurrentChannelAtomType}
 */
export const currentChannel = atom({
    key: "currentChannel",
    default: null,
    dangerouslyAllowMutability: true,
});

/**
 * @type {import('@/types/index.d.ts').GuildBaseStore}
 */
export const guildStore = atom({
    key: "guilds",
    default: [],
    dangerouslyAllowMutability: true,
});

/**
 * @type {import('@/types/index.d.ts').ChannelBaseStore}
 */
export const channelStore = atom({
    key: "channels",
    default: [],
    dangerouslyAllowMutability: true,
});

/**
 * @type {import('@/types/index.d.ts').LastChannelCache}
 */
export const lastChannelCache = atom({
    key: "lastChannelCache",
    default: {},
    effects: [localStorageEffect("lastChannelCache")],
});

/**
 * @type {import('@/types/index.d.ts').CollapsedChannels}
 */
export const collapsedChannels = atom({
    key: "collapsedChannels",
    default: [],
    effects: [localStorageEffect("collapsedChannels")],
});