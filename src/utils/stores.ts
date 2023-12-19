import { BaseChannel, BaseGuild, Client } from "@kastelll/wrapper";
import { atom } from "recoil";
import localStorageEffect from "./effects/localStorage.ts";
import Translation from "./translation.ts";

export const readyStore = atom<boolean>({
  key: "ready",
  default: false,
});

export const tokenStore = atom<string>({
  key: "token",
  // @ts-expect-error -- this is fine
  default: null,
  effects: [localStorageEffect("token")],
});

export const clientStore = atom<Client>({
  key: "client",
  // @ts-expect-error -- this is fine
  default: null,
  dangerouslyAllowMutability: true,
});

export const currentGuild = atom<BaseGuild>({
  key: "currentGuild",
  // @ts-expect-error -- this is fine
  default: null,
  dangerouslyAllowMutability: true,
});

export const currentChannel = atom<BaseChannel>({
  key: "currentChannel",
  // @ts-expect-error -- this is fine
  default: null,
  dangerouslyAllowMutability: true,
});

export const guildStore = atom<BaseGuild[]>({
  key: "guilds",
  default: [],
  dangerouslyAllowMutability: true,
});

export const channelStore = atom<BaseChannel[]>({
  key: "channels",
  default: [],
  dangerouslyAllowMutability: true,
});

export const lastChannelCache = atom<Record<string, string[]>>({
  key: "lastChannelCache",
  default: {},
  effects: [localStorageEffect("lastChannelCache")],
});

export const collapsedChannels = atom<string[]>({
  key: "collapsedChannels",
  default: [],
  effects: [localStorageEffect("collapsedChannels")],
});

export const isDesktop = atom({
  key: "isDesktop",
  default: false,
});

export const translationStore = atom({
  key: "translation",
  default: new Translation(),
});
