import Websocket from "../WebSocket.ts";
import StringFormatter from "@/wrapper/utils/StringFormatter.ts";
import { GuildMemberChunkPayload } from "$/types/payloads/events/guildMemberChunk.ts";
import guildMemberAdd from "./GuildMemberAdd.ts";

const isGuildMemberAddPayload = (
  data: unknown,
): data is GuildMemberChunkPayload => {
  if (typeof data !== "object" || data === null || data === undefined)
    return false;

  const items = ["guildId", "members"];

  for (const item of items) {
    if (!(item in data)) return false;
  }

  return true;
};

const guildMemberChunk = (ws: Websocket, data: unknown) => {
  if (!isGuildMemberAddPayload(data)) {
    StringFormatter.log(
      `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid guildMemberChunk Payload")}`,
      data,
    );

    return;
  }

  for (const member of data.members) {
    guildMemberAdd(ws, {
      ...member,
      guildId: data.guildId,
    });
  }
};

export default guildMemberChunk;
