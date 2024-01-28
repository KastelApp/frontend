import { HelloPayload } from "@/wrapper/types/payloads/hello.ts";
import Websocket from "../WebSocket.ts";
import StringFormatter from "@/wrapper/utils/StringFormatter.ts";

const isHelloPayload = (data: unknown): data is HelloPayload => {
    if (typeof data !== "object" || data === null || data === undefined) return false;

    if (!("heartbeatInterval" in data)) return false;
    if (!("sessionId" in data)) return false;

    return true;
}

const hello = (ws: Websocket, data: unknown) => {
    if (!isHelloPayload(data)) {
        StringFormatter.log(
            `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid Hello Payload")}`,
            data
        )

        return;
    }

    ws.heartbeatInterval = data.heartbeatInterval;
    ws.sessionId = data.sessionId;

    ws.identify();
}

export default hello;