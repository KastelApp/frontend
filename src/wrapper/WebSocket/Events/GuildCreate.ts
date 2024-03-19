import Websocket from "../WebSocket.ts";
import StringFormatter from "@/wrapper/utils/StringFormatter.ts";
import {
  useGuildStore,
  useChannelStore,
  useRoleStore,
} from "$/utils/Stores.ts";
import constants from "$/utils/constants.ts";
import TextBasedChannel from "$/Client/Structures/Channels/TextBasedChannel.ts";
import CategoryChannel from "$/Client/Structures/Channels/CategoryChannel.ts";
import MarkdownBasedChannel from "$/Client/Structures/Channels/MarkdownBasedChannel.ts";
import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import { Channel, Guild } from "$/types/payloads/ready.ts";
import Role from "$/Client/Structures/Guild/Role.ts";
import GuildType from "$/Client/Structures/Guild/Guild.ts";

const isGuildCreatePayload = (data: unknown): data is Guild => {
  if (typeof data !== "object" || data === null || data === undefined)
    return false;

  if (!("id" in data)) return false;
  if (!("name" in data)) return false;

  return "features" in data;
};

const guildCreate = (ws: Websocket, data: unknown) => {
  if (!isGuildCreatePayload(data)) {
    StringFormatter.log(
      `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid Guild Create Payload")}`,
      data,
    );

    return;
  }

  const channels: BaseChannel[] = [];
  const roles: Role[] = [];

  for (const chan of data.channels!) {
    const channel = chan as Channel;

    switch (channel.type) {
      case constants.channelTypes.GuildText: {
        channels.push(new TextBasedChannel(ws, channel, data.id));

        break;
      }

      case constants.channelTypes.GuildCategory: {
        channels.push(new CategoryChannel(ws, channel, data.id));

        break;
      }

      case constants.channelTypes.GuildMarkdown: {
        channels.push(new MarkdownBasedChannel(ws, channel, data.id));

        break;
      }

      default: {
        channels.push(new BaseChannel(ws, channel, data.id));
      }
    }
  }

  for (const role of data.roles!) {
    roles.push(new Role(ws, role, data.id!));
  }

  useChannelStore.getState().addChannels(channels);
  useRoleStore.getState().addRoles(roles);
  useGuildStore.getState().addGuild(new GuildType(ws, data, false));
};

export default guildCreate;
