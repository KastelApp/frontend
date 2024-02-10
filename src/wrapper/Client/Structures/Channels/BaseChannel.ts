import DMBasedChannel from "./DMBasedChannel.ts";
import TextBasedChannel from "./TextBasedChannel.ts";
import VoiceBasedChannel from "./VoiceBasedChannel.ts";
import { Channel, PermissionOverrides } from "$/types/payloads/ready.ts";
import Websocket from "$/WebSocket/WebSocket.ts";
import { getRecoil } from "recoil-nexus";
import { guildStore } from "$/utils/Stores.ts";

class BaseChannel {
    #ws: Websocket;

    public get ws() {
        return this.#ws;
    }

    public set ws(ws: Websocket) {
        this.#ws = ws;
    }

    public name: string;

    public description: string | null;

    public id: string;

    public parentId?: string;

    public ageRestricted: boolean;

    public slowmode: number;

    public type: number;

    public childrenIds: string[];

    public permissionOverrides: PermissionOverrides;

    public position: number;

    public partial: boolean;

    public guildId: string;

    public constructor(ws: Websocket, data: Partial<Channel>, guildId?: string, partial = false) {
        this.#ws = ws;

        this.name = data.name ?? "Unknown Channel";

        this.description = data.description ?? null;

        this.id = data.id ?? "";

        this.parentId = data.parentId;

        this.ageRestricted = data.ageRestricted ?? false;

        this.slowmode = data.slowmode ?? 0;

        this.type = data.type ?? 0;

        this.childrenIds = data.children ?? [];

        this.permissionOverrides = data.permissionOverrides ?? {};

        this.position = data.position ?? 0;

        this.guildId = guildId ?? "";

        this.partial = partial;
    }

    public get parent() {
        return this.guild!.channels.find((c) => c.id === this.parentId);
    }

    public get children() {
        return this.guild!.channels.filter((c) => this.childrenIds.includes(c.id));
    }

    public get guild() {
        return getRecoil(guildStore).find((g) => g.id === this.guildId);
    }

    public isDmBased(): this is DMBasedChannel {
        return this instanceof DMBasedChannel;
    }

    public isTextBased(): this is (DMBasedChannel | TextBasedChannel) {
        return this instanceof TextBasedChannel;
    }

    public isVoiceBased(): this is VoiceBasedChannel {
        return this instanceof VoiceBasedChannel;
    }
}

export default BaseChannel;