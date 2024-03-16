import Websocket from "$/WebSocket/WebSocket.ts";
import { CreateInviteOptions, CreateInviteResponse } from "$/types/http/invites/createInvite.ts";
import { ChannelProperty, Guild as RawGuild } from "$/types/payloads/ready.ts";
import StringFormatter from "$/utils/StringFormatter.ts";
import createGsetters from "$/utils/createGsetters.ts";
class Guild {
    #ws: Websocket;

    public get ws() {
        return this.#ws;
    }

    public set ws(ws: Websocket) {
        this.#ws = ws;
    }

    @createGsetters("guild")
    private _name: string;
    public name!: string;

    @createGsetters("guild")
    private _description: string | null;
    public description!: string | null;

    @createGsetters("guild")
    private _features: string[];
    public features!: string[];

    @createGsetters("guild")
    private _id: string;
    public id!: string;

    @createGsetters("guild")
    private _icon: string | null;
    public icon!: string | null;

    @createGsetters("guild")
    private _ownerId: string;
    public ownerId!: string;

    @createGsetters("guild")
    private _coOwnerIds: string[];
    public coOwnerIds!: string[];

    @createGsetters("guild")
    private _maxMembers: number;
    public maxMembers!: number;

    @createGsetters("guild")
    private _flags: number;
    public flags!: number;

    @createGsetters("guild")
    private _partial: boolean;
    public partial!: boolean;
    
    @createGsetters("guild")
    private _properties: ChannelProperty[];
    public properties!: ChannelProperty[];

    public constructor(ws: Websocket, data: Partial<RawGuild>, partial = false) { // ? Partial guilds should be rare, they are from invites (or if the guild is unavailable)
        this.#ws = ws;

        this._name = data.name ?? "Unknown Guild";

        this._description = data.description ?? null;

        this._features = data.features ?? [];

        this._id = data.id ?? "";

        this._icon = data.icon ?? null;

        this._ownerId = data.owner?.id ?? "";

        this._coOwnerIds = data.coOwners?.map((o) => o.id) ?? [];

        this._maxMembers = data.maxMembers ?? 0;

        this._flags = data.flags ?? 0;

        this._partial = partial;

        this._properties = data.channelProperties ?? [];
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

    public async delete() {
        if (this.partial) {
            StringFormatter.log(
                `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[Guild]")} ${StringFormatter.white(`[${this.id} (${this.name})] Cannot delete a partial guild.`)}`
            )

            return;
        }

        const request = await this.#ws.client?.api.delete(`/guilds/${this.id}`);

        if (!request?.ok || request.status !== 204) {
            StringFormatter.log(
                `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[Guild]")} ${StringFormatter.white(`[${this.id} (${this.name})] Failed to delete guild.`)}`
            )

            return false;
        }

        return true;
    }

    public async createInvite(opts: CreateInviteOptions): Promise<{
        success: boolean; errors: {
            unknown: boolean;
        }; data?: CreateInviteResponse | undefined;
    }> {
        const request = await this.#ws.client?.api.post<CreateInviteResponse, CreateInviteOptions>(`/guilds/${this.id}/invites`, opts);

        if (!request?.ok  || request.status >= 400) {
            return {
                success: false,
                errors: {
                    unknown: true
                }
            }
        }

        return {
            success: true,
            errors: {
                unknown: false
            },
            data: await request.json()
        };
    }
}

export default Guild;