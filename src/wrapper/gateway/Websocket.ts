import Logger from "@/utils/Logger.ts";
import handleMessage from "./handleMessage.ts";
import { opCodes } from "@/utils/Constants.ts";

class Websocket {
    #token: string;

    public GATEWAY_URL = process.env.API_WS_URL || "ws://localhost:62240";

    public VERSION: string = process.env.API_VERSION || "1";

    public ENCODING = "json";

    private ws: WebSocket | null = null;

    public heartbeatInterval = 0;

    public lastHeartbeat = 0;

    public lastHeartbeatAck = 0;

    public sessionId: string | null = null;

    public sessionWorker: Worker = new Worker("/workers/interval.worker.js");

    public sequence: number = 0;

    #listeners = new Map<string, ((...args: unknown[]) => void)[]>()

    public constructor(token: string) {
        this.#token = token;

        this.sessionWorker.onmessage = (event) => {
            const { op, session } = event.data;

            if (session !== this.sessionId) return; // ? not our session to worry about

            if (op === 3) {
                this.send({
                    op: opCodes.heartbeat,
                    data: {
                        seq: this.sequence,
                    },
                });

                this.lastHeartbeat = Date.now();

                this.sessionWorker.postMessage({
                    op: 4,
                    data: {
                        session: this.sessionId,
                    },
                });
            }
        };
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


    public get token() {
        return this.#token;
    }

    public set token(token: string) {
        this.#token = token;

        if (this.ws) {
            this.ws.close();

            this.ws = null;

            Logger.warn("Token was changed, closing the current connection", "Wrapper | WebSocket");
        }
    }

    /**
     * Connect to the gateway
     */
    public async connect() {
        if (this.ws) {
            Logger.warn("Already connected to the gateway", "Wrapper | WebSocket");

            return;
        }

        this.ws = new WebSocket(`${this.GATEWAY_URL}/?version=v${this.VERSION}&encoding=${this.ENCODING}`);

        this.ws.onopen = () => {
            Logger.info("Connected to the gateway", "Wrapper | WebSocket");

            this.emit("open")
        };

        this.ws.onmessage = (event) => {
            handleMessage(this, event.data);
        };

        this.ws.onclose = () => {
            Logger.warn("Connection to the gateway was closed", "Wrapper | WebSocket");

            this.ws = null;

            this.reconnect();

            this.emit("close")
        };
    }

    public async reconnect() {
        if (this.ws) {
            this.ws.close();

            this.ws = null;

            Logger.warn("Killed existing socket due to reconnecting to the gateway", "Wrapper | WebSocket");
        }

        Logger.info("Reconnecting to the gateway", "Wrapper | WebSocket");

        // ? The timeout is in-case we get into an infinite loop of reconnecting, we don't want to flood tons of requests
        await new Promise((resolve) => setTimeout(resolve, 1500));

        this.connect();
    }

    /**
     * Decompress some data
     * @param data The data to decompress
     * @returns The decompressed data
     */
    public decompress(data: unknown): string {
        // t! At some point we are going to use zstd for compression, for now we just return the data since its a string
        return data as string;
    }

    /**
     * Send some data to the gateway
     * @param data The data to send
     */
    public send(data: unknown) {
        if (!this.ws) {
            Logger.warn("No connection to the gateway", "Wrapper | WebSocket");

            return;
        }

        if (typeof data === "string" || data instanceof ArrayBuffer || data instanceof Blob) {
            this.ws.send(data);

            return;
        }

        this.ws.send(JSON.stringify(data));
    }

    /**
     * Get the current ping of the connection, this is not 100% accurate since it goes based off how long it took for the server to respond to a heartbeat
     */
    public get ping() {
        return Math.abs(this.lastHeartbeat - this.lastHeartbeatAck);
    }
}

export default Websocket;