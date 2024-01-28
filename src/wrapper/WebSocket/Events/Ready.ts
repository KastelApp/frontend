import Websocket from "../WebSocket.ts";
import StringFormatter from "@/wrapper/utils/StringFormatter.ts";
import { ReadyPayload } from "@/wrapper/types/payloads/ready.ts";

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
}

export default ready;