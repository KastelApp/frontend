import { HubMemberAddPayload } from "@/types/payloads/events/hubMemberAdd.ts";
import FlagFields from "@/utils/FlagFields.ts";
import Logger from "@/utils/Logger.ts";
import Websocket from "@/wrapper/gateway/Websocket.ts";
import { useMemberStore } from "@/wrapper/Stores/Members.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";

const isHubMemberAdd = (payload: unknown): payload is HubMemberAddPayload => {
    if (payload === null || typeof payload !== "object") return false;

    if (!("hubId" in payload)) return false;
    if (!("joinedAt" in payload)) return false;

    return true;
};

const hubMemberAdd = (ws: Websocket, payload: unknown) => {
    if (!isHubMemberAdd(payload)) {
        Logger.warn("Invalid Hub Member Add Payload", "Wrapper | WebSocket");

        return;
    }

    useMemberStore.getState().addMember({
        ...payload,
        hubId: payload.hubId,
        joinedAt: new Date(payload.joinedAt),
        userId: payload.user.id,
        nickname: payload.nickname || null,
    });

    const flagFields = new FlagFields(payload.user.flags, "0");

    useUserStore.getState().addUser({
        username: payload.user.username,
        id: payload.user.id,
        flags: payload.user.flags,
        publicFlags: payload.user.publicFlags,
        avatar: payload.user.avatar,
        tag: payload.user.tag,
        isBot: flagFields.has("Bot"),
        isSystem: flagFields.has("System"),
        isGhost: flagFields.has("Ghost"),
    });
};

export default hubMemberAdd;
