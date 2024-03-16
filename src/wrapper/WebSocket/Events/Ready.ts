import Websocket from "../WebSocket.ts";
import StringFormatter from "$/utils/StringFormatter.ts";
import { ReadyPayload } from "$/types/payloads/ready.ts";
import { useChannelStore, useGuildStore, useMemberStore, useRoleStore, useSettingsStore, useUserStore } from "$/utils/Stores.ts";
import User from "$/Client/Structures/User/User.ts";
import Role from "$/Client/Structures/Guild/Role.ts";
import Member from "$/Client/Structures/Guild/Member.ts";
import Guild from "$/Client/Structures/Guild/Guild.ts";
import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import constants from "$/utils/constants.ts";
import TextBasedChannel from "$/Client/Structures/Channels/TextBasedChannel.ts";
import CategoryChannel from "$/Client/Structures/Channels/CategoryChannel.ts";
import MarkdownBasedChannel from "$/Client/Structures/Channels/MarkdownBasedChannel.ts";
import { SettingsPayload } from "$/types/http/user/settings.ts";

const isReadyPayload = (data: unknown): data is ReadyPayload => {
    if (typeof data !== "object" || data === null || data === undefined) return false;

    if (!("user" in data)) return false;
    if (!("guilds" in data)) return false;
    if (!("settings" in data)) return false;
    if (!("presence" in data)) return false;

    if (!(typeof data.user === "object" && data.user !== null && data.user !== undefined)) return false;
    if (!(Array.isArray(data.guilds))) return false;
    if (!(typeof data.settings === "object" && data.settings !== null && data.settings !== undefined)) return false;
    if (!(Array.isArray(data.presence))) return false;

    if (!("id" in data.user)) return false;

    return true;
};

const ready = (ws: Websocket, data: unknown) => {
    if (!isReadyPayload(data)) {
        StringFormatter.log(
            `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid Ready Payload")}`,
            data
        );

        return;
    }

    ws.startHeartbeating();

    useSettingsStore.setState({ settings: {
        ...data.settings,
        navBarLocation: "bottom",
        emojiPack: "twemoji"
    } });

    const readyData: {
        roles: Role[],
        channels: BaseChannel[],
        members: Member[],
        users: User<boolean>[],
        guilds: Guild[];
    } = {
        roles: [],
        channels: [],
        members: [],
        users: [
            new User(ws, data.user, data.presence, true, false, data.settings as unknown as SettingsPayload)
        ],
        guilds: []
    };

    for (const guild of data.guilds) {
        for (const role of guild.roles) {
            readyData.roles.push(new Role(ws, role, guild.id));
        }

        for (const channel of guild.channels) {
            switch (channel.type) {
                case constants.channelTypes.GuildText: {
                    readyData.channels.push(new TextBasedChannel(ws, channel, guild.id));

                    break;
                }

                case constants.channelTypes.GuildCategory: {
                    readyData.channels.push(new CategoryChannel(ws, channel, guild.id));

                    break;
                }

                case constants.channelTypes.GuildMarkdown: {
                    readyData.channels.push(new MarkdownBasedChannel(ws, channel, guild.id));

                    break;
                }

                default: {
                    readyData.channels.push(new BaseChannel(ws, channel, guild.id));
                }
            }
        }

        for (const member of guild.members) {
            if (!readyData.users.find((o) => o.id === member.user.id)) {
                readyData.users.push(new User(ws, member.user, member.presence, false, true));
            } else if (readyData.users.find((o) => o.id === member.user.id && o.partial)) {
                readyData.users = [
                    ...readyData.users.filter((o) => o.id !== member.user.id),
                    new User(ws, member.user, member.presence, false, true)
                ];
            }

            if (!readyData.members.find((o) => o.userId === member.user.id && o.guildId === guild.id)) {
                readyData.members.push(new Member(ws, member, guild.id, false));
            } else if (readyData.members.find((o) => o.userId === member.user.id && o.guildId === guild.id && o.partial)) {
                readyData.members = [
                    ...readyData.members.filter((o) => o.userId !== member.user.id && o.guildId !== guild.id),
                    new Member(ws, member, guild.id, false)
                ];
            }
        }

        for (const coOwner of guild.coOwners) {
            if (!readyData.users.find((o) => o.id === coOwner.id)) {
                readyData.users.push(new User(ws, coOwner, [], false, true));
            } else if (readyData.users.find((o) => o.id === coOwner.id && o.partial)) {
                readyData.users = [
                    ...readyData.users.filter((o) => o.id !== coOwner.id),
                    new User(ws, coOwner, [], false, true)
                ];
            }

            const member = new Member(ws, { user: coOwner, owner: false, roles: [], nickname: null }, guild.id, true);

            member.coOwner = true;

            if (!readyData.members.find((o) => o.userId === coOwner.id && o.guildId === guild.id)) {
                readyData.members.push(member);
            } else if (readyData.members.find((o) => o.userId === coOwner.id && o.guildId === guild.id && o.partial)) {
                readyData.members = [
                    ...readyData.members.filter((o) => o.userId !== coOwner.id && o.guildId !== guild.id),
                    member
                ];
            }
        }

        readyData.guilds.push(new Guild(ws, guild, false));
    }

    useRoleStore.getState().setRoles(readyData.roles);
    useChannelStore.getState().setChannels(readyData.channels);
    useMemberStore.getState().setMembers(readyData.members);
    useUserStore.getState().setUsers(readyData.users);
    useGuildStore.getState().setGuilds(readyData.guilds);

    ws.status = "Ready";
};

export default ready;