import Websocket from "../WebSocket.ts";
import StringFormatter from "@/wrapper/utils/StringFormatter.ts";
import { GuildMemberAddPayload } from "$/types/payloads/events/guildMemberAdd.ts";
import { useMemberStore, useUserStore } from "$/utils/Stores.ts";
import User from "$/Client/Structures/User/User.ts";
import Member from "$/Client/Structures/Guild/Member.ts";

const isGuildMemberAddPayload = (
  data: unknown,
): data is GuildMemberAddPayload => {
  if (typeof data !== "object" || data === null || data === undefined)
    return false;

  const items = ["user", "owner", "nickname", "roles"];

  for (const item of items) {
    if (!(item in data)) return false;
  }

  return true;
};

const guildMemberAdd = (ws: Websocket, data: unknown) => {
  if (!isGuildMemberAddPayload(data)) {
    StringFormatter.log(
      `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid GuildMemberAdd Payload")}`,
      data,
    );

    return;
  }

  const userStore = useUserStore.getState();
  const memberStore = useMemberStore.getState();

  if (!userStore.users.find((u) => u.id === data.user.id)) {
    userStore.addUser(new User(ws, data.user, data.presence, false, true));
  }

  if (
    !memberStore.members.find(
      (m) => m.userId === data.user.id && m.guildId === data.guildId,
    )
  ) {
    memberStore.addMember(new Member(ws, data, data.guildId, false));
  }
};

export default guildMemberAdd;
