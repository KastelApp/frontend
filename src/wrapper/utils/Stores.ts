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
})

export const messageStore = atom({
    default: [
        {
          user: {
            name: "Tea Cup",
            avatar: "/icon-3.png",
            presence: "online",
            username: "Tea Cup",
            discriminator: "0001",
          },
          content: "Hello world!",
          time: "Yesterday at 1:52 AM",
        },
        {
          user: {
            name: "Darkerink",
            avatar: "/icon-4.png",
            presence: "idle",
            username: "Darkerink",
            discriminator: "2927",
          },
          content: "Hello",
          time: "12/12/2020 1:52 AM",
        },
        {
          user: {
            name: "Test",
            avatar: "/icon-2.png",
            presence: "dnd",
            username: "Test",
            discriminator: "2340",
          },
          content: "Whats up?",
          time: "Today at 1:52 AM",
        },
        {
          user: {
            name: "Someone",
            avatar: "/icon-3.png",
            presence: "offline",
            username: "Someone",
            discriminator: "3428",
          },
          content: "Howdy",
          time: "Yesterday at 4:51 PM",
        },
        {
          user: {
            name: "goop",
            avatar: "/icon-4.png",
            presence: "online",
            username: "goop",
            discriminator: "8923",
          },
          content: "true",
          time: "12/12/2020 1:52 AM",
        },
        {
          user: {
            name: "Taco",
            avatar: "/icon-2.png",
            presence: "idle",
            username: "Taco",
            discriminator: "6940",
          },
          content: "false",
          time: "Today at 1:52 AM",
        },
        {
          user: {
            name: "Apple",
            avatar: "/icon-2.png",
            presence: "dnd",
            username: "Apple",
            discriminator: "4200",
          },
          content: "Oh my...",
          time: "Today at 8:15 AM",
        },
      ],
    key: "messages",
    dangerouslyAllowMutability: true
})