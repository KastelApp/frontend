/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import API from "$/API/API.ts";
import Websocket from "$/WebSocket/WebSocket.ts";
import { ClientOptions } from "$/types/client.ts";
import { GuildCreateResponse } from "$/types/client/CreateGuild.ts";
import {
  LoginOptions,
  RegisterAccountOptions,
  RegisterLoginResponse,
} from "$/types/client/RegisterAndLogin.ts";
import { ApiLoginOptions, LoginResponse } from "$/types/http/auth/login.ts";
import {
  ApiRegisterOptions,
  RegisterResponse,
} from "$/types/http/auth/register.ts";
import { isErrorResponse } from "$/types/http/error.ts";
import { CreateGuildOptions } from "$/types/http/guilds/createGuild.ts";
import { JoinInvitePayload } from "$/types/http/invites/joinInvite.ts";
import { status } from "$/types/ws.ts";
import Events from "$/utils/Events.ts";
import Snowflake from "$/utils/Snowflake.ts";
import constants from "$/utils/constants.ts";

type events = "unAuthed" | "ready" | "unReady" | "statusUpdate";

interface Client {
  on(event: "statusUpdate", listener: (status: status) => void): this;
  on(event: "unAuthed", listener: () => void): this;
  on(event: "ready", listener: () => void): this;
  on(event: "unReady", listener: () => void): this;
  emit(event: "statusUpdate", status: status): boolean;
  emit(event: "unAuthed"): boolean;
  emit(event: "ready"): boolean;
  emit(event: "unReady"): boolean;
}

class Client extends Events {
  #ws: Websocket;

  #_events: Map<events, ((...data: never) => void)[]> = new Map();

  public regexes = {
    guildAndChannel: /guilds\/(\d+)\/channels\/(\d+)/,
    guild: /guilds\/(\d+)/,
    channel: /channels\/(\d+)/,
  };

  public worker?: Worker; // ? Worker is used to stay alive in the background (since when the tab goes to sleep, the timings for intervals and timeouts are fucked up which will cause the ws to miss a heartbeat)

  public snowflake = new Snowflake(
    constants.snowflake.Epoch,
    constants.snowflake.WorkerId,
    constants.snowflake.ProcessId,
    constants.snowflake.TimeShift,
    constants.snowflake.WorkerIdBytes,
    constants.snowflake.ProcessIdBytes,
  );

  public api: API;

  public constructor(options: ClientOptions) {
    super();

    this.#ws = new Websocket(
      options.wsOptions ?? {
        compress: true,
        encoding: "json",
        url: options.wsUrl ?? "ws://localhost:62240",
        version: options.version ?? "1",
      },
      this,
    );

    this.#ws.on("statusUpdate", (status) => {
      this.emit("statusUpdate", status);

      if (status === "Ready") {
        this.emit("ready");
      } else if (status === "UnAuthed") {
        this.emit("unAuthed");
      } else if (status === "Reconnecting") {
        this.emit("unReady");
      }
    });

    this.api = new API(options.restOptions ?? {}, this);
  }

  public get token() {
    return this.ws.token;
  }

  public async register(
    options: RegisterAccountOptions,
  ): Promise<RegisterLoginResponse> {
    const request = await this.api.post<RegisterResponse, ApiRegisterOptions>(
      "/auth/register",
      {
        email: options.email,
        username: options.username,
        password: options.password,
        inviteCode: options.inviteCode,
        platformInviteCode: options.platformInviteCode,
      },
      {
        noVersion: true,
      },
    );

    if (!request.ok || request.status >= 500) {
      return {
        errors: {
          email: false,
          maxUsernames: false,
          password: false,
          unknown: {},
          username: false,
          captchaRequired: false,
          internalError: true,
        },
        success: false,
      };
    }

    const json = await request.json();

    if (
      isErrorResponse<{
        email: {
          code: "InvalidEmail";
          message: string;
        };
        username: {
          code: "MaxUsernames";
          message: string;
        };
        platformInvite: {
          code: "MissingInvite" | "InvalidInvite";
          message: string;
        };
      }>(json)
    ) {
      return {
        errors: {
          email: json.errors.email?.code === "InvalidEmail",
          password: false,
          internalError: false,
          captchaRequired: false,
          username: json.errors.username?.code === "MaxUsernames",
          maxUsernames: false,
          unknown: json.errors,
        },
        success: false,
      };
    }

    if (options.resetClient) {
      this.ws.token = json.token;
    }

    return {
      success: true,
      token: json.token,
      userData: json.user,
    };
  }

  public async login(options: LoginOptions): Promise<RegisterLoginResponse> {
    const request = await this.api.post<LoginResponse, ApiLoginOptions>(
      "/auth/login",
      {
        email: options.email,
        password: options.password,
      },
      {
        noVersion: true,
      },
    );

    if (!request.ok || request.status >= 500) {
      return {
        errors: {
          email: false,
          maxUsernames: false,
          password: false,
          unknown: {},
          username: false,
          captchaRequired: false,
          internalError: true,
        },
        success: false,
      };
    }

    const json = await request.json();

    if (
      isErrorResponse<{
        login: {
          code:
            | "BadLogin"
            | "MissingPassword"
            | "AccountDeleted"
            | "AccountDataUpdate"
            | "AccountDisabled";
          message: string;
        };
      }>(json)
    ) {
      return {
        errors: {
          email: json.errors.login?.code === "BadLogin",
          password: json.errors.login?.code === "BadLogin",
          internalError: false,
          captchaRequired: false,
          username: false,
          maxUsernames: false,
          unknown: json.errors,
        },
        success: false,
      };
    }

    if (options.resetClient) {
      this.ws.token = json.token;
    }

    return {
      success: true,
      token: json.token,
      userData: null,
    };
  }

  public async fetchInvite(code: string) {}

  public async joinInvite(code: string): Promise<{
    success: boolean;
    errors: {
      unknown: boolean;
    };
    data: JoinInvitePayload | null;
  }> {
    const request = await this.api.post<JoinInvitePayload>(`/invites/${code}`);

    if (!request.ok || request.status >= 400) {
      return {
        success: false,
        errors: {
          unknown: true,
        },
        data: null,
      };
    }

    return {
      success: true,
      errors: {
        unknown: false,
      },
      data: await request.json(),
    };
  }

  public async logout() {
    const request = await this.api.post("/auth/logout");

    this.ws.token = null;

    return request.ok && request.status < 400;
  }

  public async resetPassword(email: string) {
    const request = await this.api.post(
      "/auth/forgot",
      {
        email,
      },
      {
        noVersion: true,
      },
    );

    return request.ok && request.status < 400;
  }

  public async changePassword({
    newPassword,
    resetClient,
    token,
    id,
  }: {
    newPassword: string;
    resetClient: boolean;
    token: string;
    id: string;
  }) {
    const request = await this.api.patch<{
      token: string;
      userId: string;
    }>(
      "/auth/reset",
      {
        id,
        token,
        password: newPassword,
      },
      {
        noVersion: true,
      },
    );

    if (!request.ok || request.status >= 400) {
      return {
        success: request.ok && request.status < 400,
        token: undefined,
      };
    }

    const tok = (await request.json()).token as string;

    if (resetClient) {
      this.ws.token = tok;
    }

    return {
      success: request.ok && request.status < 400,
      token: tok,
    };
  }

  public async valdateAuth({ id, token }: { id: string; token: string }) {
    const request = await this.api.post(
      "/auth/reset",
      {
        id,
        token,
      },
      {
        noVersion: true,
      },
    );

    return request.ok && request.status < 400;
  }

  public connect(token: string) {
    this.#ws.connect(token);
  }

  public get ws() {
    return this.#ws;
  }

  public async createGuild(
    options: CreateGuildOptions,
  ): Promise<GuildCreateResponse> {
    const request = await this.api.post<CreateGuildOptions, CreateGuildOptions>(
      "/guilds",
      options,
    );

    const json = await request.json();

    if (
      isErrorResponse<{
        guild: {
          code: "MaxGuildsReached";
          message: string;
        };
        name: {
          code: "InvalidType";
          message: string;
        };
      }>(json)
    ) {
      return {
        success: false,
        errors: {
          invalidName: json.errors.name?.code === "InvalidType",
          maxGuildsReached: json.errors.guild?.code === "MaxGuildsReached",
          unknown: json.errors,
        },
      };
    }

    return {
      success: true,
      guild: json,
    };
  }

  public async deleteGuild(guildId: string): Promise<boolean> {
    const request = await this.api.delete(`/guilds/${guildId}`);

    return request.ok;
  }
}

export default Client;
