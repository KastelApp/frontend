import Websocket from "$/WebSocket/WebSocket.ts";
import { Role as RawRole } from "$/types/payloads/ready.ts";

class Role {
    #ws: Websocket;

    public get ws() {
        return this.#ws;
    }

    public set ws(ws: Websocket) {
        this.#ws = ws;
    }

    public name: string;

    public color: number;

    public hoist: boolean;

    public id: string;

    public permissions: unknown[]; // todo: finish permission system

    public position: number;

    public allowedAgeRestricted: boolean;

    public guildId: string;

    public constructor(ws: Websocket, data: Partial<RawRole>, guildId: string) { // ? roles cannot be partial, if you have a non full role, then its a bug - darkerink (2024-02-09 (YYYY-MM-DD))
        this.#ws = ws;

        this.name = data.name ?? "Unknown Role";

        this.color = data.color ?? 0;

        this.hoist = data.hoist ?? false;

        this.id = data.id ?? "";

        this.permissions = data.permissions ?? [];

        this.position = data.position ?? 0;

        this.allowedAgeRestricted = data.allowedAgeRestricted ?? false;

        this.guildId = guildId;
    }
}

export default Role;