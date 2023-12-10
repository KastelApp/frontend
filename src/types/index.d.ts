import { BaseChannel, BaseGuild, Client } from "@kastelll/wrapper";
import { RecoilState, SetterOrUpdater } from "recoil";

export interface LastChannelCache {
    [key: string]: string;
}

export type ReadyState = RecoilState<boolean>;
export type ClientAtomType = RecoilState<Client | null>;
export type ClientToken = RecoilState<string | null>;
export type LastChannelCacheAtomType = RecoilState<LastChannelCache>;
export type CollapsedChannels = RecoilState<string[]>;
export type ChannelBaseStore = RecoilState<BaseChannel[]>;
export type GuildBaseStore = RecoilState<BaseGuild[]>;
export type CurrentGuildAtomType = RecoilState<BaseGuild | null>;
export type CurrentChannelAtomType = RecoilState<BaseChannel | null>;

export type Options = {
    ready: SetterOrUpdater<BaseGuild[]>;
    client: SetterOrUpdater<Client | null>;
    token: SetterOrUpdater<string | null>;
    channelBaseStore: SetterOrUpdater<BaseChannel[]>;
    guildBaseStore: SetterOrUpdater<BaseGuild[]>;
    currentGuild: SetterOrUpdater<BaseGuild | null>;
    currentChannel: SetterOrUpdater<BaseChannel | null>;
};