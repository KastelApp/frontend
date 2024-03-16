import { SettingsPayload, UpdateSettingsOptions } from "$/types/http/user/settings.ts";
import { Presence, UserPayload } from "$/types/payloads/ready.ts";
import createGsetters from "$/utils/createGsetters.ts";
import Websocket from "$/WebSocket/WebSocket.ts";

class User<IsClient extends boolean = false> {

    @createGsetters("user")
    public _id: string;
    public id!: string;

    @createGsetters("user")
    public _email: IsClient extends true ? string : null;
    public email!: IsClient extends true ? string : null;

    @createGsetters("user")
    public _emailVerified: IsClient extends true ? boolean : false;
    public emailVerified!: IsClient extends true ? boolean : false;

    @createGsetters("user")
    public _username: string;
    public username!: string;

    @createGsetters("user")
    public _globalNickname: string | null;
    public globalNickname!: string | null;

    @createGsetters("user")
    public _tag: string;
    public tag!: string;

    @createGsetters("user")
    public _avatar: string | null;
    public avatar!: string | null;

    @createGsetters("user")
    public _publicFlags: string;
    public publicFlags!: string;

    @createGsetters("user")
    public _flags: string;
    public flags!: string;

    @createGsetters("user")
    public _phoneNumber: IsClient extends true ? string : null;
    public phoneNumber!: IsClient extends true ? string : null;

    @createGsetters("user")
    public _mfaEnabled: IsClient extends true ? boolean : false;
    public mfaEnabled!: IsClient extends true ? boolean : false;

    @createGsetters("user")
    public _mfaVerified: IsClient extends true ? boolean : false;
    public mfaVerified!: IsClient extends true ? boolean : false;

    @createGsetters("user")
    public _bio: string | null;
    public bio!: string | null;

    @createGsetters("user")
    public _presence: Presence[];
    public presence!: Presence[];

    @createGsetters("user")
    public _isClient: IsClient;
    public isClient!: IsClient;

    @createGsetters("user")
    public _partial: boolean;
    public partial!: boolean;

    #ws: Websocket;

    public get ws() {
        return this.#ws;
    }

    public set ws(ws: Websocket) {
        this.#ws = ws;
    }

    @createGsetters("user")
    public _settings: Partial<SettingsPayload>
    public settings!: Partial<SettingsPayload>;

    public constructor(ws: Websocket, data: Partial<UserPayload>, presence: Presence[], isClient: IsClient, partial = false, settings?: SettingsPayload) {
        this._id = ws.snowflake.validate(data.id ?? "") ? data.id! : ws.snowflake.generate(); // ? just generate a fake id, this shouldn't happen but we don't want to fail to generate a default avatar

        this._email = (isClient ? data.email : null) as IsClient extends true ? string : null;

        this._emailVerified = (isClient ? data.emailVerified : false) as IsClient extends true ? boolean : false;

        this._username = data.username ?? "Unknown User";

        this._globalNickname = data.globalNickname ?? null;

        this._tag = data.tag ?? "0000";

        this._avatar = data.avatar ?? null;

        this._publicFlags = data.publicFlags ?? "0";

        this._flags = data.flags ?? "0";

        this._phoneNumber = (isClient ? data.phoneNumber : null) as IsClient extends true ? string : null;

        this._mfaEnabled = (isClient ? data.mfaEnabled : false) as IsClient extends true ? boolean : false;

        this._mfaVerified = (isClient ? data.mfaVerified : false) as IsClient extends true ? boolean : false;

        this._bio = data.bio ?? null;

        this._presence = presence;

        this._isClient = isClient;

        this._partial = partial;

        this.#ws = ws;

        this._settings = settings ?? {};
    }

    public get fullUsername() {
        return `${this.username}#${this.tag.padStart(4, "0")}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getAvatarUrl(_options?: { size: number; }) {
        if (!this.avatar) return this.defaultAvatar;

        return "";
    }

    public get defaultAvatar() {
        const number = BigInt(this.id) % 5n;

        return `/icon${number === 0n ? "" : `-${number}`}.png`;
    }

    public get currentPresence() {
        const current = this.presence.find((p) => p.current) ?? this.presence[0];

        return this.presence.some((p) => p.status === "invisible") ? "invisible" : current?.status ?? "offline";
    }

    public uploadAvatar(file: File) {
        console.log(file);
        return {
            hash: "",
            success: false
        };
    }

    public updateUser(options: {
        username?: string;
        email?: string;
        newPassword?: string;
        password?: string;
        tag?: string;
        avatar?: string | null;
    }) {
        console.log(options);
    }

    public get displayUsername() {
        if (this.globalNickname) return this.globalNickname;

        return this.username;
    }

    public get customStatus() {
        return this.presence.find((p) => p.status !== "offline" && p.state !== null)?.state ?? null;
    }

    public get activities() {
        return [];
    }

    public setCustomStatus(state: string | null) {
        return this.updateSettings({
            customStatus: state
        })
    }

    public async updateSettings(options: UpdateSettingsOptions) {
        const request = await this.#ws.client?.api.patch<SettingsPayload, UpdateSettingsOptions>("/users/@me/settings", options);

        if (!request?.ok) return false;

        this._settings = await request.json()

        return true;
    }
}

export default User;