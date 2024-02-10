import Websocket from "$/WebSocket/WebSocket.ts";
import { Guild as RawGuild } from "$/types/payloads/ready.ts";
import { channelStore, memberStore, roleStore } from "$/utils/Stores.ts";
import StringFormatter from "$/utils/StringFormatter.ts";
import { getRecoil } from "recoil-nexus";

class Guild {
    #ws: Websocket;

    public get ws() {
        return this.#ws;
    }

    public set ws(ws: Websocket) {
        this.#ws = ws;
    }

    public name: string;

    public description: string | null;

    public features: string[];

    public id: string;

    public icon: string | null;

    public ownerId: string;

    public coOwnerIds: string[];

    public maxMembers: number;

    public flags: number;

    public partial: boolean;

    public constructor(ws: Websocket, data: Partial<RawGuild>, partial = false) { // ? Partial guilds should be rare, they are from invites (or if the guild is unavailable)
        this.#ws = ws;

        this.name = "Funky | best emoji server (real)" ?? "Unknown Guild";

        this.description = data.description ?? null;

        this.features = data.features ?? [];

        this.id = data.id ?? "";

        this.icon = data.icon ?? null;

        this.ownerId = data.owner?.id ?? "";

        this.coOwnerIds = data.coOwners?.map((o) => o.id) ?? [];

        this.maxMembers = data.maxMembers ?? 0;

        this.flags = data.flags ?? 0;

        this.partial = partial;
    }

    public get members() {
        return getRecoil(memberStore).filter((m) => m.guildId === this.id);
    }

    public get channels() {
        return getRecoil(channelStore).filter((c) => c.guildId === this.id);
    }

    public get owner() {
        return this.members.find((m) => m.guildId === this.id && m.userId === this.ownerId);
    }

    public get coOwners() {
        return this.members.filter((m) => m.guildId === this.id && this.coOwnerIds.includes(m.userId));
    }

    public get roles() {
        return getRecoil(roleStore).filter((r) => r.guildId === this.id);
    }

    public get memberCount() {
        return this.members.length;
    }

    public get channelCount() {
        return this.channels.length;
    }

    // todo: add options
    public requestMembers() {}

    // todo: add options
    public requestGuild() {
        if (!this.partial) {
            StringFormatter.log(
                `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[Guild]")} ${StringFormatter.white(`[${this.id} (${this.name})] Cannot request a non-partial guild.`)}`
            )

            return;
        }
    }
}

export default Guild;