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
}

const ready = (ws: Websocket, data: unknown) => {
    if (!isReadyPayload(data)) {
        StringFormatter.log(
            `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid Ready Payload")}`,
            data
        )

        return;
    }

    ws.startHeartbeating();

    ws.status = "Ready";

    setRecoil(userStore, (old) => {
        return [
            ...old.filter((o) => o.id !== data.user.id),
            new User(ws, data.user, data.presence, true)
        ]
    })

    setRecoil(settingsStore, data.settings);

    for (const guild of data.guilds) {
        for (const role of guild.roles) {
            setRecoil(roleStore, (old) => {
                return [
                    ...old.filter((o) => o.id !== role.id),
                    new Role(ws, role, guild.id)
                ]
            
            })
        }

        for (const channel of guild.channels) {
            switch (channel.type) {
                default: {
                    setRecoil(channelStore, (old) => {
                        return [
                            ...old.filter((o) => o.id !== channel.id),
                            new BaseChannel(ws, channel, guild.id)
                        ]
                    });
                }
            }
        }

        for (const member of guild.members) {
            setRecoil(userStore, (old) => {
                if (old.find((o) => o.id === member.user.id && !o.partial)) return old; // ! they aren't partial, no need to update
                
                return [
                    ...old.filter((o) => o.id !== member.user.id),
                    new User(ws, member.user, [], false, true)
                ]
            })

            setRecoil(memberStore, (old) => {
                return [
                    ...old.filter((o) => o.partial && o.userId === member.user.id && o.guildId === guild.id),
                    new Member(ws, member, guild.id, false)
                ]
            })
        }

        for (const coOwner of guild.coOwners) {
            setRecoil(userStore, (old) => {
                if (old.find((o) => o.id === coOwner.id && !o.partial)) return old; // ! they aren't partial, no need to update
                
                return [
                    ...old.filter((o) => o.id !== coOwner.id),
                    new User(ws, coOwner, [], false, true)
                ]
            })

            setRecoil(memberStore, (old) => {
                const member = new Member(ws, { user: coOwner, owner: false, roles: [], nickname: null }, guild.id, true);

                member.coOwner = true;

                return [
                    ...old.filter((o) => o.partial && o.userId === coOwner.id && o.guildId === guild.id),
                    member
                ]
            })
        }

        setRecoil(guildStore, (old) => {
            return [
                ...old.filter((o) => o.id !== guild.id),
                new Guild(ws, guild, false)
            ]
        });

        setTimeout(() => {
            // add a fake member and user to the store
            setRecoil(userStore, (old) => {
                return [
                    ...old,
                    new User(ws, { id: "0", username: "Unknown User", tag: "0000", avatar: null }, [], false, true)
                ]
            })

            setRecoil(memberStore, (old) => {
                return [
                    ...old,
                    new Member(ws, { user: { id: "0", avatar: "", flags: "0", publicFlags: "0", username: "Unknown" }, owner: false, roles: [], nickname: null }, guild.id, true)
                ]
            })

            console.log("done")
        }, 5000)
    }
}

export default ready;