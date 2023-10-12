import { Writable } from "svelte/store";
import { BaseStore, BaseChannel, BaseGuild } from "@kastelll/wrapper";

export interface LastChannelCache {
    [key: string]: string;
}

export interface Modal {
    id: string;
    textInputOptions: {
        id: string;
        value: string;
    }[];
    checkboxeOptions: {
        id: string;
        enabled: boolean;
    }[];
}

export type ChannelBaseStore = Writable<BaseStore<string, BaseChannel>>;
export type GuildBaseStore = Writable<BaseStore<string, BaseGuild>>;