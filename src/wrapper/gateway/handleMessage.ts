import safeParse from "@/utils/safeParse.ts";
import Websocket from "./Websocket.ts";
import { EventPayload } from "@/types/payloads/event.ts";
import Logger from "@/utils/Logger.ts";
import Constants, { opCodes } from "@/utils/Constants.ts";
import { HelloPayload } from "@/types/payloads/hello.ts";
import event from "./Events/Event.ts";
import { ReadyPayload } from "@/types/payloads/ready.ts";
import { useUserStore } from "../Stores/UserStore.ts";
import { useGuildStore } from "../Stores/GuildStore.ts";
import { useChannelStore } from "../Stores/ChannelStore.ts";
import { useMemberStore } from "../Stores/Members.ts";
import { useRoleStore } from "../Stores/RoleStore.ts";

const handleMessage = async (ws: Websocket, data: unknown) => {
    const decompressed = safeParse<EventPayload>(ws.decompress(data));

    if (!decompressed) {
        Logger.warn("Failed to decompress message", "Gateway | HandleMessage");

        console.log(data);

        return;
    }

    if (decompressed.seq && decompressed.seq > ws.sequence) ws.sequence = decompressed.seq;

    switch (decompressed.op) {
        case opCodes.hello: {
            const data = decompressed.data as HelloPayload;

            ws.heartbeatInterval = data.heartbeatInterval;
            ws.sessionId = data.sessionId;

            // ? This will be at some point for statistics, though for now its pretty pointless
            const os = navigator.userAgent.includes("Windows") ? "Windows"
                : navigator.userAgent.includes("Mac") ? "Mac"
                    : navigator.userAgent.includes("Linux") ? "Linux"
                        : (navigator.userAgent.includes("Android") || navigator.userAgent.includes("iPhone")) ? "Mobile"
                            : "Unknown";

            ws.send({
                op: opCodes.identify,
                data: {
                    token: ws.token,
                    meta: {
                        client: "wrapper",
                        os,
                        // ? This will always be browser until we start releasing the desktop app / mobile app.
                        device: "browser",
                    },
                }
            });

            break;
        }

        case opCodes.ready: {
            Logger.info("Received Ready Payload", "Gateway | HandleMessage");

            const data = decompressed.data as ReadyPayload;

            ws.sessionWorker.postMessage({
                op: 1,
                data: {
                    interval: ws.heartbeatInterval - (ws.heartbeatInterval * 0.1),
                    session: ws.sessionId,
                },
            });

            useUserStore.getState().addUser({
                ...data.user,
                isClient: true,
            });

            useUserStore.getState().addUser({
                username: "Kiki",
                defaultAvatar: "/icon.png",
                isSystem: true,
                tag: "0000",
                publicFlags: String(Constants.publicFlags.StaffBadge),
                flags: String(Constants.privateFlags.System),
                id: Constants.fakeUserIds.kiki,
            });

            useUserStore.getState().addUser({
                username: "Ghost",
                defaultAvatar: "/icon.png",
                isSystem: true,
                tag: "0000",
                publicFlags: String(Constants.publicFlags.GhostBadge),
                flags: String(Constants.privateFlags.Ghost),
                id: Constants.fakeUserIds.ghost,
            });

            for (const guild of data.guilds) {
                useGuildStore.getState().addGuild({
                    name: guild.name,
                    unavailable: guild.unavailable,
                    ownerId: guild.owner.id,
                    maxMembers: guild.maxMembers,
                    id: guild.id,
                    icon: guild.icon,
                    flags: guild.flags,
                    features: guild.features,
                    description: guild.description,
                    coOwners: guild.coOwners.map((coOwner) => coOwner.id),
                    channelProperties: guild.channelProperties
                });

                for (const channel of guild.channels) {
                    useChannelStore.getState().addChannel({
                        ...channel,
                        guildId: guild.id
                    });
                }

                for (const member of guild.members) {
                    useMemberStore.getState().addMember({
                        ...member,
                        guildId: guild.id,
                        joinedAt: new Date(member.joinedAt),
                        userId: member.user.id,
                        nickname: member.nickname || null,
                    });

                    useUserStore.getState().addUser({
                        username: member.user.username,
                        id: member.user.id,
                        flags: member.user.flags,
                        publicFlags: member.user.publicFlags,
                        avatar: member.user.avatar,
                        tag: member.user.tag,
                    });
                }

                for (const role of guild.roles) {
                    useRoleStore.getState().addRole({
                        ...role,
                        guildId: guild.id,
                        hoisted: role.hoist,
                    });
                }
            }

            setTimeout(() => ws.emit("ready"), 500);

            break;
        }

        case opCodes.heartbeatAck: {
            ws.lastHeartbeatAck = Date.now();

            Logger.info(`Heartbeat Acknowledged, current ping: ${ws.ping}ms`, "Gateway | HandleMessage");

            break;
        }

        case opCodes.event: {
            event(ws, decompressed);

            break;
        }
    }
};

export default handleMessage;