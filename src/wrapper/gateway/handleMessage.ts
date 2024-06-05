import safeParse from "@/utils/safeParse.ts";
import Websocket from "./Websocket.ts";
import { EventPayload } from "@/types/payloads/event.ts";
import Logger from "@/utils/Logger.ts";
import { opCodes } from "@/utils/Constants.ts";
import { HelloPayload } from "@/types/payloads/hello.ts";
import event from "./Events/Event.ts";
import { ReadyPayload } from "@/types/payloads/ready.ts";
import { useUserStore } from "../Stores/UserStore.ts";

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
            })

            break;
        }

        case opCodes.heartbeatAck: {
            ws.lastHeartbeatAck = Date.now();

            Logger.info(`Heartbeat Acknowledged, current ping: ${ws.ping}ms`, "Gateway | HandleMessage");

            break;
        }

        case opCodes.event: {
            event(ws, decompressed.data);

            break;
        }
    }
};

export default handleMessage;