/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { encoding, status, WebsocketSettings } from "$/types/ws.ts";
import StringFormatter from "$/utils/StringFormatter.ts";
import constants, { opCodes } from "$/utils/constants.ts";
import { Identify } from "$/types/events.ts";
import hello from "./Events/Hello.ts";
import eventEvent from "./Events/Event.ts";
import ready from "./Events/Ready.ts";
import Client from "$/Client/Client.ts";
import Events from "$/utils/Events.ts";
import Snowflake from "$/utils/Snowflake.ts";

export type events = "offline" | "online" | "statusUpdate";

interface Websocket {
  on(event: "statusUpdate", listener: (status: status) => void): this;
  on(event: "offline", listener: () => void): this;
  on(event: "online", listener: () => void): this;
  emit(event: "statusUpdate", status: status): boolean;
  emit(event: "offline"): boolean;
  emit(event: "online"): boolean;
}

class Websocket extends Events {
  public compression: boolean = true;

  public encoding: encoding = "json";

  public url: string = "ws://localhost:62240";

  public version: string = "1";

  #token: string | null = null;

  public _status: status = "Disconnected";

  public set status(status: status) {
    StringFormatter.log(
      `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Changing status to")} ${StringFormatter.orange(status)} ${StringFormatter.white("from")} ${StringFormatter.orange(this._status)}`,
    );

    this._status = status;

    this.emit("statusUpdate", status);
  }

  public get status() {
    return this._status;
  }

  public sessionId: string = "";

  public heartbeatInterval: number = 0;

  private lastHeartbeatSent: number = 0;

  private lastHeartbeatAck: number = 0;

  private worker!: Worker;

  private workerId: string =
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

  public sequence: number = 0;

  private connectedAt: number = 0;

  private maxAttempts: number = 15;

  private timeout: number = 1_000;

  private currentAttempt: number = 0;

  #ws!: WebSocket;

  #client?: Client;

  public snowflake = new Snowflake(
    constants.snowflake.Epoch,
    constants.snowflake.WorkerId,
    constants.snowflake.ProcessId,
    constants.snowflake.TimeShift,
    constants.snowflake.WorkerIdBytes,
    constants.snowflake.ProcessIdBytes,
  );

  public constructor(opts: Partial<WebsocketSettings>, client?: Client) {
    super();

    this.compression = opts.compress ?? true;

    this.encoding = opts.encoding ?? "json";

    this.url = opts.url ?? "ws://localhost:62240";

    this.version = opts.version?.replace("v", "") ?? "1";

    this.#client = client;

    if ("window" in globalThis) {
      window.addEventListener("offline", () => {
        this.status = "Offline";

        this.emit("offline");
      });

      window.addEventListener("online", () => {
        this.status = "Disconnected";

        this.emit("online");
      });
    }
  }

  public connect(token: string) {
    if (
      this.status === "Connected" ||
      this.status === "Ready" ||
      this.status === "Connecting"
    ) {
      StringFormatter.log(
        `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Already connected")}`,
      );

      return;
    }

    if (
      this.status === "Offline" ||
      this.status === "Reconnecting" ||
      this.status === "Resuming"
    )
      return;

    if (!token) {
      StringFormatter.log(
        `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("No token provided")}`,
      );

      return;
    }

    this.#token = token;

    this.status = "Connecting";

    this.#ws = new WebSocket(
      `${this.url}/?version=${this.version}&encoding=${this.encoding}&compress=${this.compression}`,
    );

    this.handleOpen();
  }

  public get token() {
    return this.#token;
  }

  public set token(token: string | null) {
    this.#token = token;

    if (this.#ws && this.#ws.readyState === WebSocket.OPEN) {
      this.#ws.close();
    }
  }

  public reconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.#ws && this.#ws.readyState === WebSocket.OPEN) {
        this.#ws.close();
      }

      if (this.currentAttempt >= this.maxAttempts) {
        this.status = "UnRecoverable";

        return resolve();
      }

      if (this.status === "Offline") return resolve();

      this.status = "Reconnecting";

      this.currentAttempt++;

      setTimeout(() => {
        this.#ws = new WebSocket(
          `${this.url}/?version=${this.version}&encoding=${this.encoding}&compress=${this.compression}`,
        );

        this.handleOpen();

        resolve();
      }, this.timeout);
    });
  }

  private handleOpen() {
    if (!this.#ws) {
      StringFormatter.log(
        `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("WebSocket is not defined")}`,
      );

      return;
    }

    this.#ws.onopen = () => {
      this.connectedAt = Date.now();

      this.status = "Connected";
    };

    this.#ws.onmessage = (event) => {
      const validMsg = this.isValidMessage(event.data);

      if (!validMsg) {
        StringFormatter.log(
          `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Received unknown message")}`,
          event.data,
        );

        return;
      }

      const parsed = this.parseMessageData(event.data);

      // never trust the server :3 (for now until I fix any issues relating to sequence numbers)
      if (parsed.seq) this.sequence++;

      switch (parsed.op) {
        case opCodes.hello: {
          hello(this, parsed.data);

          break;
        }

        case opCodes.ready: {
          ready(this, parsed.data);

          this.sequence = parsed.seq ?? 1;

          break;
        }

        case opCodes.heartbeatAck: {
          this.lastHeartbeatAck = Date.now();

          break;
        }

        case opCodes.event: {
          eventEvent(this, parsed);

          break;
        }

        default: {
          StringFormatter.log(
            `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Received unknown opcode")}`,
            parsed,
          );
        }
      }
    };

    this.#ws.onclose = async (event) => {
      this.worker?.terminate();

      if (this.status === "Offline") {
        StringFormatter.log(
          `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Disconnected due to being offline")}`,
          event,
        );

        return;
      }

      this.status = "Disconnected";

      StringFormatter.log(
        `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Disconnected")}`,
        event,
      );

      if (event.code === 4001) {
        this.status = "UnAuthed";

        StringFormatter.log(
          `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Invalid token, or no token was provided")}`,
        );

        return;
      }

      await this.reconnect();
    };
  }

  private isValidMessage(
    data: unknown,
  ): data is { op: number; data: unknown; seq?: number } {
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

    return parsed as { op: number; data: unknown; seq?: number };
  }

  public disconnect() {
    if (this.#ws) {
      this.#ws.close();
    }
  }

  public send<T = unknown>(data: T) {
    if (!this.#ws || !["Connected", "Ready", "Resuming"].includes(this.status))
      return;

    this.#ws.send(JSON.stringify(data));
  }

  private heartbeat() {
    if (!this.#ws || this.status !== "Ready") {
      StringFormatter.log(
        `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Heartbeat failed due to not being ready")}`,
      );

      return;
    }

    this.lastHeartbeatSent = Date.now();

    this.send({
      op: opCodes.heartbeat,
      data: {
        seq: this.sequence,
      },
    });
  }

  public startHeartbeating() {
    if (!this.#ws || this.status !== "Connected") return;

    this.worker = new Worker("/workers/interval.worker.js");

    this.worker.onmessage = (event) => {
      const { op, session } = event.data;

      if (op === 3) {
        if (session === this.workerId) {
          this.heartbeat();

          this.worker.postMessage({
            op: 4,
            data: {
              session: this.workerId,
            },
          });
        } else {
          StringFormatter.log(
            `${StringFormatter.purple("[Wrapper]")} ${StringFormatter.green("[WebSocket]")} ${StringFormatter.white("Heartbeat session mismatch")}`,
            event.data,
          );
        }
      }
    };

    this.worker.postMessage({
      op: 1,
      data: {
        interval: this.heartbeatInterval,
        session: this.workerId,
      },
    });
  }

  public identify() {
    if (!this.#ws || this.status !== "Connected" || !this.#token) return;

    this.send<Identify>({
      op: opCodes.identify,
      data: {
        token: this.#token,
        meta: {
          client: "wrapper",
          os: "Windows",
          device: "browser",
        },
      },
    });
  }

  public get ping() {
    if (!this.#ws || this.status !== "Connected") return 0;

    return Date.now() - this.connectedAt;
  }

  public get client() {
    return this.#client;
  }

  public set client(client: Client | undefined) {
    this.#client = client;
  }
}

export default Websocket;
