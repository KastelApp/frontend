import { MessageCreatePayload } from "@/types/payloads/events/messageCreate.ts";
import getInviteCodes from "@/utils/getInviteCodes.ts";
import Logger from "@/utils/Logger.ts";
import Websocket from "@/wrapper/gateway/Websocket.ts";
import { useMessageStore } from "@/wrapper/Stores/MessageStore.ts";

const isMessageUpdate = (payload: unknown): payload is MessageCreatePayload => {
	if (payload === null || typeof payload !== "object") return false;

	if (!("channelId" in payload)) return false;
	if (!("content" in payload)) return false;

	return true;
};

const messageUpdate = async (ws: Websocket, payload: unknown) => {
	if (!isMessageUpdate(payload)) {
		Logger.warn("Invalid Message Create Payload", "Wrapper | WebSocket");

		return;
	}

	const foundMessage = useMessageStore.getState().messages.find((message) => message.id === payload.id);

	if (!foundMessage) {
		Logger.warn("Message not found", "Wrapper | WebSocket");

		return;
	}

	const invites = getInviteCodes(payload.content);
	const discordInvites = getInviteCodes(payload.content, true);

	setTimeout(() => {
		useMessageStore.getState().editMessage(
			payload.id,
			{
				...foundMessage,
				...payload,
				creationDate: new Date(payload.creationDate),
				editedDate: payload.editedDate ? new Date(payload.editedDate) : null,
				invites,
				discordInvites,
			} as never,
			true,
		);
	}, 75);
};

export default messageUpdate;
