import Websocket from "../Websocket.ts";
import { EventPayload } from "@/types/payloads/event.ts";
import Logger from "@/utils/Logger.ts";
import hubCreate from "@/wrapper/gateway/Events/hubCreate.ts";
import hubMemberAdd from "@/wrapper/gateway/Events/hubMemberAdd.ts";
import messageCreate from "@/wrapper/gateway/Events/messageCreate.ts";
import messageDelete from "@/wrapper/gateway/Events/messageDelete.ts";
import messageUpdate from "@/wrapper/gateway/Events/messageUpdate.ts";
import typing from "@/wrapper/gateway/Events/typing.ts";

const isEventPayload = (data: unknown): data is EventPayload => {
	if (typeof data !== "object" || data === null || data === undefined) return false;

	if (!("event" in data)) return false;
	if (!("op" in data)) return false;
	if (!("data" in data)) return false;

	return true;
};

const event = (ws: Websocket, data: unknown) => {
	if (!isEventPayload(data)) {
		Logger.warn("Invalid Event Payload", "Wrapper | WebSocket");
		console.log(data);

		return;
	}

	switch (data.event) {
		case "Typing": {
			typing(ws, data.data);

			break;
		}

		case "MessageCreate": {
			messageCreate(ws, data.data);

			break;
		}

		case "MessageDelete": {
			messageDelete(ws, data.data);

			break;
		}

		case "MessageUpdate": {
			messageUpdate(ws, data.data);

			break;
		}

		case "HubCreate": {
			hubCreate(ws, data.data);

			break;
		}

		case "HubDelete": {
			console.log(ws, data.data);

			break;
		}

		case "HubMemberAdd": {
			hubMemberAdd(ws, data.data);

			break;
		}

		case "HubMemberChunk": {
			console.log(ws, data.data);

			break;
		}

		case "PresencesUpdate": {
			console.log(ws, data.data);

			break;
		}

		case "HubMemberRemove": {
			console.log(ws, data.data);

			break;
		}

		default: {
			Logger.warn(`Unknown Event ${data.event}`, "Wrapper | WebSocket");
			console.log(data);

			break;
		}
	}
};

export default event;
