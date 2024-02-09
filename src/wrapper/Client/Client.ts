import Websocket from "$/WebSocket/WebSocket.ts";
import { ClientOptions } from "$/types/client.ts";
import { guildStore, roleStore, channelStore, inviteStore, memberStore, settingsStore, userStore } from "$/utils/Stores.ts";
import { getRecoil } from "recoil-nexus";

class Client {
    #ws: Websocket;

    public constructor(options: ClientOptions) {
        this.#ws = new Websocket(options.wsOptions ?? {
            compress: true,
            encoding: "json",
            url: "ws://localhost:62240",
            version: "1"
        });
    }

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
}

export default Client;
