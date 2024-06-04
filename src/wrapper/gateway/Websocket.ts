import Logger from "@/utils/Logger.ts";

class Websocket {
    #token: string;

    public GATEWAY_URL = process.env.API_WS_URL || "ws://localhost:62240";

    public VERSION: string = process.env.API_VERSION || "1";

    public ENCODING = "json";

    private ws: WebSocket | null = null;

    public constructor(token: string) {
        this.#token = token;
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

        this.ws = new WebSocket(`${this.GATEWAY_URL}/?version=v${this.VERSION}&encoding=${this.ENCODING}&token=${this.#token}`);

        this.ws.onopen = () => {
            Logger.info("Connected to the gateway", "Wrapper | WebSocket");
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            Logger.info("Received data from the gateway", "Wrapper | WebSocket");

            console.log(data);
        };

        this.ws.onclose = () => {
            Logger.warn("Connection to the gateway was closed", "Wrapper | WebSocket");

            this.ws = null;
        };
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
}

export default Websocket;