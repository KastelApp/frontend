import Websocket from "../WebSocket.ts";
import StringFormatter from "@/wrapper/utils/StringFormatter.ts";
import { EventPayload } from "$/types/payloads/event.ts";
import typing from "./Typing.ts";
import messageCreate from "./MessageCreate.ts";
import guildCreate from "./GuildCreate.ts";
import guildDelete from "./GuildDelete.ts";
import guildMemberAdd from "./GuildMemberAdd.ts";

const isEventPayload = (data: unknown): data is EventPayload => {
    if (typeof data !== "object" || data === null || data === undefined) return false;

    if (!("event" in data)) return false;
    if (!("op" in data)) return false;
    if (!("data" in data)) return false;

    return true;
}

const event = (ws: Websocket, data: unknown) => {
    if (!isEventPayload(data)) {
        StringFormatter.log(
            `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid Event Payload")}`,
            data
        )

        return;
    }

    switch (data.event) {
        case "Typing": {
            typing(ws, data.data)

            break;
        }

        case "MessageCreate": {
            messageCreate(ws, data.data)

            break;
        }

        case "GuildCreate": {
            guildCreate(ws, data.data)

            break;
        }

        case "GuildDelete": {
            guildDelete(ws, data.data)

            break;
        }

        case "GuildMemberAdd": {
            guildMemberAdd(ws, data.data)

            break;
        }

        default: {
            StringFormatter.log(
                `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid Event")} ${StringFormatter.red(data.event)}`,
                data
            )

            break;
        }
    }
}

export default event;