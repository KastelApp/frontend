import Logger from "@/utils/Logger.ts";
import handleMessage from "./handleMessage.ts";
import { opCodes } from "@/utils/Constants.ts";
import pako from "pako";
import { encoding } from "@/types/ws.ts";
import EventEmitter from "@/wrapper/EventEmitter.ts";

interface Websocket {
	on(event: "ready", listener: () => void): this;
	on(event: "open", listener: () => void): this;
	on(event: "close", listener: (code: number, reason: string) => void): this;

	emit(event: "ready"): boolean;
	emit(event: "open"): boolean;
	emit(event: "close", code: number, reason: string): boolean;
}

class Websocket extends EventEmitter {
	#token: string | null;

	public GATEWAY_URL = process.env.API_WS_URL || "ws://localhost:62240";

	public VERSION: string = process.env.API_VERSION || "1";

	// ? in development environments, we use json to make it easier to debug else we use zlib to compress the data
	public ENCODING: encoding = process.env.NODE_ENV === "development" ? "json" : "zlib";

	private ws: WebSocket | null = null;

	public heartbeatInterval = 0;

	public lastHeartbeat = 0;

	public lastHeartbeatAck = 0;

	public sessionId: string | null = null;

	public sessionWorker: Worker = new Worker("/workers/interval.worker.js");

	public sequence: number = 0;

	#listeners = new Map<string, ((...args: unknown[]) => void)[]>();

	public constructor(token: string) {
		super();

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

	public get token() {
		return this.#token;
	}

	public set token(token: string | null) {
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

		if (!this.token) {
			Logger.warn("No token provided, cannot connect to the gateway", "Wrapper | WebSocket");

			return;
		}

		this.ws = new WebSocket(`${this.GATEWAY_URL}/?version=v${this.VERSION}&encoding=${this.ENCODING}`);

		this.ws.onopen = () => {
			Logger.info("Connected to the gateway", "Wrapper | WebSocket");

			this.emit("open");
		};

		this.ws.onmessage = (event) => {
			handleMessage(this, event.data);
		};

		this.ws.onclose = (close) => {
			Logger.warn(`Connection to the gateway was closed - ${close.reason} (${close.code})`, "Wrapper | WebSocket");

			this.ws = null;

			this.reconnect();

			this.emit("close", close.code, close.reason);
		};
	}

	private willReconnect = true;

	public stopReconnect() {
		this.willReconnect = false;
	}

	public async reconnect() {
		if (!this.willReconnect) {
			Logger.warn("Reconnect was stopped", "Wrapper | WebSocket");

			return;
		}

		if (this.ws) {
			this.ws.close();

			this.ws = null;

			Logger.warn("Killed existing socket due to reconnecting to the gateway", "Wrapper | WebSocket");
		}

		Logger.info("Reconnecting to the gateway", "Wrapper | WebSocket");

		// ? The timeout is in-case we get into an infinite loop of reconnecting, we don't want to flood tons of requests
		await new Promise((resolve) => setTimeout(resolve, 1500));

		if (!this.willReconnect) {
			Logger.warn("Reconnect was stopped", "Wrapper | WebSocket");

			return;
		}

		this.connect();
	}

	/**
	 * Decompress some data
	 * @param data The data to decompress
	 * @returns The decompressed data
	 */
	public async decompress(data: unknown): Promise<string | null> {
		if (typeof data === "string") {
			return data;
		}

		if (data instanceof Blob) {
			const arrayBuffer = await data.arrayBuffer();

			const decompressed = pako.inflate(arrayBuffer, { to: "string" });

			return decompressed;
		}

		return null;
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

		data = this.ENCODING === "json" ? data : pako.deflate(JSON.stringify(data));

		if (typeof data === "string" || data instanceof ArrayBuffer || data instanceof Blob || data instanceof Uint8Array) {
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
