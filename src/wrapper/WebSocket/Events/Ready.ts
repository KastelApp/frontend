import Websocket from "../WebSocket.ts";
import StringFormatter from "$/utils/StringFormatter.ts";
import { ReadyPayload } from "$/types/payloads/ready.ts";
import { channelStore, guildStore, memberStore, roleStore, settingsStore, userStore } from "$/utils/Stores.ts";
import { setRecoil } from "recoil-nexus";
import User from "$/Client/Structures/User.ts";
import Role from "$/Client/Structures/Guild/Role.ts";
import Member from "$/Client/Structures/Guild/Member.ts";
import Guild from "$/Client/Structures/Guild/Guild.ts";
import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";

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

    setRecoil(settingsStore, data.settings);

    const recoilData: {
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
            new User(ws, data.user, data.presence, true)
        ],
        guilds: []
    };

    for (const guild of data.guilds) {
        for (const role of guild.roles) {
            recoilData.roles.push(new Role(ws, role, guild.id));
        }

        for (const channel of guild.channels) {
            switch (channel.type) {
                default: {
                    recoilData.channels.push(new BaseChannel(ws, channel, guild.id));
                }
            }
        }

        for (const member of guild.members) {
            if (!recoilData.users.find((o) => o.id === member.user.id)) {
                recoilData.users.push(new User(ws, member.user, [], false, true));
            } else if (recoilData.users.find((o) => o.id === member.user.id && o.partial)) {
                recoilData.users = [
                    ...recoilData.users.filter((o) => o.id !== member.user.id),
                    new User(ws, member.user, [], false, true)
                ];
            }

            if (!recoilData.members.find((o) => o.userId === member.user.id && o.guildId === guild.id)) {
                recoilData.members.push(new Member(ws, member, guild.id, false));
            } else if (recoilData.members.find((o) => o.userId === member.user.id && o.guildId === guild.id && o.partial)) {
                recoilData.members = [
                    ...recoilData.members.filter((o) => o.userId !== member.user.id && o.guildId !== guild.id),
                    new Member(ws, member, guild.id, false)
                ];
            }
        }

        for (const coOwner of guild.coOwners) {
            if (!recoilData.users.find((o) => o.id === coOwner.id)) {
                recoilData.users.push(new User(ws, coOwner, [], false, true));
            } else if (recoilData.users.find((o) => o.id === coOwner.id && o.partial)) {
                recoilData.users = [
                    ...recoilData.users.filter((o) => o.id !== coOwner.id),
                    new User(ws, coOwner, [], false, true)
                ];
            }

            const member = new Member(ws, { user: coOwner, owner: false, roles: [], nickname: null }, guild.id, true);

            member.coOwner = true;

            if (!recoilData.members.find((o) => o.userId === coOwner.id && o.guildId === guild.id)) {
                recoilData.members.push(member);
            } else if (recoilData.members.find((o) => o.userId === coOwner.id && o.guildId === guild.id && o.partial)) {
                recoilData.members = [
                    ...recoilData.members.filter((o) => o.userId !== coOwner.id && o.guildId !== guild.id),
                    member
                ];
            }
        }

        recoilData.guilds.push(new Guild(ws, guild, false));

        setTimeout(() => {
            // add a fake member and user to the store
            setRecoil(userStore, (old) => {
                return [
                    ...old,
                    new User(ws, { id: "0", username: "Unknown User", tag: "0000", avatar: null }, [], false, true)
                ];
            });

            setRecoil(memberStore, (old) => {
                return [
                    ...old,
                    new Member(ws, { user: { id: "0", avatar: "", flags: "0", publicFlags: "0", username: "Unknown" }, owner: false, roles: [], nickname: null }, guild.id, true)
                ];
            });
        }, 5000);
    }

    setRecoil(roleStore, recoilData.roles);
    setRecoil(channelStore, recoilData.channels);
    setRecoil(memberStore, recoilData.members);
    setRecoil(userStore, recoilData.users);
    setRecoil(guildStore, recoilData.guilds);

    ws.status = "Ready";
};

export default ready;