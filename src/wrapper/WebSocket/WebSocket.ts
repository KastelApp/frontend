import { encoding, status, websocketSettings } from "$/types/ws.ts";
import { atom } from "recoil";
import StringFormatter from "../utils/StringFormatter.ts";
import { getRecoil, setRecoil } from "recoil-nexus";

export const testStatusStore = atom<status>({
    default: "Disconnected",
    key: "testStatus",
})

class Websocket {
    public compression: boolean = true;

    public encoding: encoding = "json";

    public url: string = "ws://localhost:62240"

    public version: string = "1";

    #token: string = "";

    public status: status = "Disconnected";

    private sessionId: string = "";

    private heartbeatInterval: number = 0;

    private lastHeartbeatAck: number = 0;

    private worker!: Worker;

    private workerId: string = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    private sequence: number = 0;

    private connectedAt: number = 0;

    #ws!: WebSocket;

    public constructor(opts: websocketSettings) {
        this.compression = opts.compress;

        this.encoding = opts.encoding;

        this.url = opts.url;

        this.version = opts.version;

        if ("window" in globalThis) {
            window.addEventListener("offline", () => {
                console.log("Offline")
                this.status = "Offline";
            });
    
            window.addEventListener("online", () => {
                this.status = "Disconnected";
            });
        }

        // let lastStatusType: status = "Disconnected";

        setInterval(() => {
            const lastStatusType = getRecoil(testStatusStore);

            if (this.status === lastStatusType) return;

            StringFormatter.log(
                `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Changing status to")} ${StringFormatter.orange(this.status)}`
            );

            setRecoil(testStatusStore, this.status);
        }, 200)
    }

    public connect(token: string) {
        if (this.status === "Connected" || this.status === "Ready" || this.status === "Connecting") {
            StringFormatter.log(
                `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Already connected")}`
            );

            return;
        }

        if (this.status === "Offline" || this.status === "Reconnecting" || this.status === "Resuming") return;

        this.status = "Connecting";

        this.#token = token;

        this.#ws = new WebSocket(`${this.url}/?version=${this.version}&encoding=${this.encoding}&compress=${this.compression}`);

        this.handleOpen()
    }

    private handleOpen() {
        this.#ws.onopen = () => {
            this.connectedAt = Date.now();
        }

        this.#ws.onmessage = (event) => {
            const validMsg = this.isValidMessage(event.data);

            if (!validMsg) {
                StringFormatter.log(
                    `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Received unknown message")}`,
                    event.data
                );

                return;
            }

            const parsed = this.parseMessageData(event.data);

            console.log(parsed)
        }

        this.#ws.onclose = (event) => {
            this.status = "Disconnected";

            StringFormatter.log(
                `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Disconnected")}`,
                event
            );
        }
    }

    private isValidMessage(data: unknown): data is { op: number; data: unknown; seq?: number} {
        try {
            const parsed = typeof data === "string" ? JSON.parse(data) : data;

            if (typeof parsed !== "object") return false;

            if (!("op" in parsed)) return false;

            if (!("data" in parsed)) return false;

            return true;
        } catch {
            return false;
        }
    }

    private parseMessageData(data: unknown) {
        const isValid = this.isValidMessage(data);

        if (!isValid) return { op: 0, data: null };

        const parsed = typeof data === "string" ? JSON.parse(data) : data;

        return parsed as { op: number; data: unknown; seq?: number};
    }

    public disconnect() {
        if (this.#ws) {
            this.#ws.close();
        }
    }
}

export default Websocket;
