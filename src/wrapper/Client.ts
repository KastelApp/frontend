import API from "./API.ts";
import { useAPIStore } from "./Stores.ts";
import Websocket from "./gateway/Websocket.ts";

class Client {
    public api: API

    public websocket: Websocket | null = null

    #token: string | null

    #listeners = new Map<string, ((...args: unknown[]) => void)[]>()
    
    public constructor() {
        this.api = useAPIStore.getState().api;

        this.#token = null;
    }

    public get token() {
        return this.#token
    }

    public on(event: string, listener: () => void) {
        const current = this.#listeners.get(event) || []

        current.push(listener)

        this.#listeners.set(event, current)
    }

    public off(event: string) {
        this.#listeners.delete(event)
    }

    public emit(event: string, ...args: unknown[]) {
        const listeners = this.#listeners.get(event)

        if (!listeners) return;

        listeners.forEach((listener) => listener(...args))
    }

    public set token(token: string | null) {
        this.#token = token
        this.api.token = token
    }

    /**
     * was unsure what else to call it, we arne't "logging in" rather just using the token to the ws, connect probably would be better but idk 
     * @param token The token to use
     */
    public async login(token: string) {
        this.token = token

        this.websocket = new Websocket(token)

        this.websocket.connect();

        this.websocket.on("ready", () => {
            this.emit("ready")
        })

        this.websocket.on("close", () => {
            this.emit("close")
        })
    }
}

export default Client;