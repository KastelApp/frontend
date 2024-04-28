import { BaseError } from "../http/error.ts";
import { CreateGuildOptions } from "../http/guilds/createGuild.ts";
import { RequestFail, RequestSuccess } from "./FailSuccess.ts";

interface GuildCreateSuccess extends RequestSuccess {
  guild: CreateGuildOptions;
}

interface GuildCreateFail extends RequestFail {
  errors: {
    unknown: {
      [key: string]: BaseError;
    };
    maxGuildsReached: boolean;
    invalidName: boolean;
  };
}

export type GuildCreateResponse = GuildCreateSuccess | GuildCreateFail;
