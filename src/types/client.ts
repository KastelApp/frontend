/* eslint-disable @typescript-eslint/no-namespace */
import { ApiSettings } from "./api.ts";
import { WebsocketSettings } from "./ws.ts";

export interface ClientOptions {
	wsOptions?: Partial<WebsocketSettings>;
	restOptions?: Partial<ApiSettings>;
	worker?: Worker;
	version: string;
	apiUrl: string;
	wsUrl: string;
	unAuthed: boolean; // ? so you can register / login using the same client
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_URL: string;
            API_WS_URL: string;
            API_VERSION: string;
            KASTEL_DESKTOP_APP: string;
            CLOUDFLARE_TURNSTILE_SITE_KEY: string;
        }
    }
}