import { LoginOptions, RegisterAccountOptions, RegisterLoginResponse } from "@/types/client/RegisterAndLogin.ts";
import API from "./API.ts";
import { useAPIStore } from "./Stores.tsx";
import Websocket from "./gateway/Websocket.ts";
import { ApiLoginOptions, LoginResponse } from "@/types/http/auth/login.ts";
import { isErrorResponse } from "@/types/http/error.ts";
import { ApiRegisterOptions, RegisterResponse } from "@/types/http/auth/register.ts";

class Client {
	public api: API;

	public websocket: Websocket | null = null;

	#token: string | null;

	#listeners = new Map<string, ((...args: unknown[]) => void)[]>();

	public isConnected = false;

	public constructor() {
		this.api = useAPIStore.getState().api;

		this.#token = null;
	}

	public get token() {
		return this.#token;
	}

	public on(event: string, listener: () => void) {
		const current = this.#listeners.get(event) || [];

		current.push(listener);

		this.#listeners.set(event, current);
	}

	public off(event: string) {
		this.#listeners.delete(event);
	}

	public emit(event: string, ...args: unknown[]) {
		const listeners = this.#listeners.get(event);

		if (!listeners) return;

		listeners.forEach((listener) => listener(...args));
	}

	public set token(token: string | null) {
		this.#token = token;
		this.api.token = token;

		if (this.websocket) {
			this.websocket.token = token;
		}
	}

	public async login(options: LoginOptions): Promise<RegisterLoginResponse> {
		const request = await this.api.post<ApiLoginOptions, LoginResponse>({
			url: "/auth/login",
			noVersion: true,
			noAuth: true,
			data: {
				email: options.email,
				password: options.password,
			},
		});

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

		if (
			isErrorResponse<{
				login: {
					code: "BadLogin" | "MissingPassword" | "AccountDeleted" | "AccountDataUpdate" | "AccountDisabled";
					message: string;
				};
			}>(request.body)
		) {
			return {
				errors: {
					email: request.body.errors.login?.code === "BadLogin",
					password: request.body.errors.login?.code === "BadLogin",
					internalError: false,
					captchaRequired: false,
					username: false,
					maxUsernames: false,
					unknown: Object.fromEntries(
						Object.entries(request.body.errors).filter(([, error]) => error.code !== "BadLogin"),
					),
				},
				success: false,
			};
		}

		if (options.resetClient) {
			this.token = request.body.token;
		}

		return {
			success: true,
			token: request.body.token,
			userData: null, // ? just logging in, we don't got the user data (register has it though)
		};
	}

	public async register(options: RegisterAccountOptions): Promise<RegisterLoginResponse> {
		const request = await this.api.post<ApiRegisterOptions, RegisterResponse>({
			url: "/auth/register",
			noVersion: true,
			noAuth: true,
			data: {
				email: options.email,
				username: options.username,
				password: options.password,
				inviteCode: options.inviteCode,
				platformInviteCode: options.platformInviteCode,
			},
		});

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
			}>(request.body)
		) {
			return {
				errors: {
					email: request.body.errors.email?.code === "InvalidEmail",
					password: false,
					internalError: false,
					captchaRequired: false,
					username: request.body.errors.username?.code === "MaxUsernames",
					maxUsernames: false,
					unknown: Object.fromEntries(
						Object.entries(request.body.errors).filter(
							([, error]) => error.code !== "InvalidEmail" && error.code !== "MaxUsernames",
						),
					),
				},
				success: false,
			};
		}

		if (options.resetClient) {
			this.token = request.body.token;
		}

		return {
			success: true,
			token: request.body.token,
			// ? We don't really use this yet, will use it for onboarding though
			userData: request.body.user,
		};
	}

	/**
	 * We connect to the ws (gateway)
	 * @param token The token to use
	 */
	public async connect(token: string) {
		this.token = token;

		this.websocket = new Websocket(token);

		this.websocket.connect();

		this.isConnected = true;

		this.websocket.on("ready", () => {
			this.emit("ready");
		});

		this.websocket.on("close", () => {
			this.emit("close");
		});
	}
}

export default Client;
