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
