/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import Websocket from "$/WebSocket/WebSocket.ts";
import { ClientOptions } from "$/types/client.ts";
import { LoginOptions, RegisterAccountOptions, RegisterLoginResponse } from "$/types/client/RegisterAndLogin.ts";
import { status } from "$/types/ws.ts";
import Events from "$/utils/Events.ts";
import { guildStore, roleStore, channelStore, inviteStore, memberStore, settingsStore, userStore } from "$/utils/Stores.ts";
import { getRecoil } from "recoil-nexus";

type events = "unAuthed" | "ready" | "unReady" | "statusUpdate";

interface Client {
    on(event: "statusUpdate", listener: (status: status) => void): this;
    on(event: "unAuthed", listener: () => void): this;
    on(event: "ready", listener: () => void): this;
    on(event: "unReady", listener: () => void): this;
    emit(event: "statusUpdate", status: status): boolean;
    emit(event: "unAuthed"): boolean;
    emit(event: "ready"): boolean;
}

class Client extends Events {
    #ws: Websocket;

    #_events: Map<events, ((...data: never) => void)[]> = new Map();

    public regexes = {
        guildAndChannel: /guilds\/(\d+)\/channels\/(\d+)/,
        guild: /guilds\/(\d+)/,
        channel: /channels\/(\d+)/
    };

    public worker?: Worker; // ? Worker is used to stay alive in the background (since when the tab goes to sleep, the timings for intervals and timeouts are fucked up which will cause the ws to miss a heartbeat)

    public constructor(options: ClientOptions) {
        super();

        this.#ws = new Websocket(options.wsOptions ?? {
            compress: true,
            encoding: "json",
            url: options.wsUrl ?? "ws://localhost:62240",
            version: options.version ?? "1"
        });

        this.#ws.on("statusUpdate", (status) => {
            this.emit("statusUpdate", status);

            if (status === "Ready") {
                this.emit("ready")
            }
        })
    }

    public async register(options: RegisterAccountOptions): Promise<RegisterLoginResponse> {
        return {
            errors: {
                email: true,
                maxUsernames: false,
                password: false,
                unknown: {},
                username: false
            },
            success: false
        }
    }

    public async login(options: LoginOptions): Promise<RegisterLoginResponse> {
        return {
            errors: {
                email: true,
                maxUsernames: false,
                password: false,
                unknown: {},
                username: false
            },
            success: false
        }
    }

    public async fetchInvite(code: string) {}

    public async joinInvite(code: string) {}

    public async logout() {}

    public connect(token: string) {
        this.#ws.connect(token);
    }

    public get ws() {
        return this.#ws;
    }

    public get guilds() {
        return getRecoil(guildStore);
    }

    public get roles() {
        return getRecoil(roleStore);
    }

    public get channels() {
        return getRecoil(channelStore);
    }

    public get invites() {
        return getRecoil(inviteStore);
    }

    public get members() {
        return getRecoil(memberStore);
    }

    public get settings() {
        return getRecoil(settingsStore);
    }

    public get users() {
        return getRecoil(userStore);
    }

    public get user() {
        return this.users.find((user) => user.isClient)!;
    }

    public get currentGuild() {
        if (!("window" in globalThis)) return null;

        const match = globalThis.window.location.pathname.match(this.regexes.guild);

        if (!match) return null;

        return this.guilds.find((g) => g.id === match[1]);
    }

    public get currentChannel() {
        if (!("window" in globalThis)) return null;

        const match = globalThis.window.location.pathname.match(this.regexes.channel);

        if (!match) return null;

        return this.channels.find((c) => c.id === match[1]);
    }

    public createGuild(options: { name: string; description: string }) {}
}

export default Client;
