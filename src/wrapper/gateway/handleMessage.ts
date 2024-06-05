import safeParse from "@/utils/safeParse.ts";
import Websocket from "./Websocket.ts";
import { EventPayload } from "@/types/payloads/event.ts";
import Logger from "@/utils/Logger.ts";
import { opCodes } from "@/utils/Constants.ts";
import { HelloPayload } from "@/types/payloads/hello.ts";

const handleMessage = async (ws: Websocket, data: unknown) => {
    const decompressed = safeParse<EventPayload>(ws.decompress(data));

    if (!decompressed) {
        Logger.warn("Failed to decompress message", "Gateway | HandleMessage");

        console.log(data);

        return;
    }

    switch (decompressed.op) {
        case opCodes.hello: {
            const data = decompressed.data as HelloPayload;

            ws.heartbeatInterval = data.heartbeatInterval;
            ws.sessionId = data.sessionId;
        }
    }
}

export default handleMessage;