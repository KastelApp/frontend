import { HubCreatePayload } from "@/types/payloads/events/hubCreate.ts";
import Logger from "@/utils/Logger.ts";
import Websocket from "@/wrapper/gateway/Websocket.ts";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useHubStore } from "@/wrapper/Stores/HubStore.ts";
import { useRoleStore } from "@/wrapper/Stores/RoleStore.ts";

const isHubCreate = (payload: unknown): payload is HubCreatePayload => {
	if (payload === null || typeof payload !== "object") return false;

	if (!("name" in payload)) return false;
	if (!("features" in payload)) return false;
	if (!("id" in payload)) return false;

	return true;
};

const hubCreate = (ws: Websocket, payload: unknown) => {
	if (!isHubCreate(payload)) {
		Logger.warn("Invalid Hub Create Payload", "Wrapper | WebSocket");

		return;
	}

    useHubStore.getState().addHub({
        name: payload.name,
        unavailable: payload.unavailable,
        ownerId: payload.ownerId,
        maxMembers: payload.maxMembers,
        id: payload.id,
        icon: payload.icon,
        flags: payload.flags,
        features: payload.features,
        description: payload.description,
        coOwners: payload.coOwnerIds,
        channelProperties: [],
        memberCount: payload.memberCount,
    });

    for (const channel of payload.channels) {
        useChannelStore.getState().addChannel({
            ...channel,
            hubId: payload.id,
        });
    }

    for (const role of payload.roles) {
        useRoleStore.getState().addRole({
            ...role,
            hubId: payload.id,
            hoisted: role.hoist,
        });
    }
};

export default hubCreate;
