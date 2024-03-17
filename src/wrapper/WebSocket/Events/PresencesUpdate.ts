import Websocket from "../WebSocket.ts";
import StringFormatter from "@/wrapper/utils/StringFormatter.ts";
import { PresencesUpdatePayload } from "$/types/payloads/events/presencesUpdate.ts";
import { useUserStore } from "$/utils/Stores.ts";
import User from "$/Client/Structures/User/User.ts";

const isPresenceUpdate = (data: unknown): data is PresencesUpdatePayload => {
    if (typeof data !== "object" || data === null || data === undefined) return false;

	if (!("guildId" in data)) return false;
	if (!("presences" in data)) return false;

	return "user" in data;
}

const presenceUpdate = (ws: Websocket, data: unknown) => {
    if (!isPresenceUpdate(data)) {
        StringFormatter.log(
            `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid PresenceUpdate Payload")}`,
            data
        )

        return;
    }

    const userState = useUserStore.getState();

    const foundUser = userState.users.find(user => user.id === data.user.id);

    if (foundUser) {
        foundUser.presence = data.presences
    } else {
        userState.users.push(new User(ws, data.user, data.presences, false, true));
    }
}

export default presenceUpdate;