import Websocket from "$/WebSocket/WebSocket.ts";
import { Member as RawMember } from "$/types/payloads/ready.ts";
import { guildStore, roleStore, userStore } from "$/utils/Stores.ts";
import { getRecoil } from "recoil-nexus";

class Member {
    #ws: Websocket;

    public get ws() {
        return this.#ws;
    }

    public set ws(ws: Websocket) {
        this.#ws = ws;
    }
    
    public guildId: string;

    public owner: boolean;

    public coOwner: boolean;

    public roleIds: string[];

    public nickname: string | null;

    public userId: string;

    public partial: boolean;

    public joinedAt: Date;

    public constructor(ws: Websocket, data: Partial<RawMember>, guildId: string, partial = false) {
        this.#ws = ws;

        this.guildId = guildId;

        this.owner = data.owner ?? false;

        this.roleIds = data.roles ?? [];

        this.nickname = data.nickname ?? null;

        this.userId = data.user?.id ?? "";

        this.coOwner = false

        this.partial = partial;

        this.joinedAt = new Date(data.joinedAt ?? Date.now());
    }

    public get guild() {
        return getRecoil(guildStore).find((g) => g.id === this.guildId);
    }

    public get roles() {
        return getRecoil(roleStore).filter((r) => this.roleIds.includes(r.id));
    }

    public get user() {
        return getRecoil(userStore).find((m) => m.id === this.userId);
    }
}

export default Member;