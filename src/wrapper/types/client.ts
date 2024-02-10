import { websocketSettings } from "./ws.ts";

export interface ClientOptions {
    wsOptions?: Partial<websocketSettings>;
    restOptions?: Partial<unknown>;
    worker?: Worker;
    version: string;
    apiUrl: string;
    wsUrl: string;
    cdnUrl: string; // ? cdnUrl is the url for uploading media
    mediaUrl: string; // ? mediaUrl is the url for getting media (soon to be deprecated and combined into the api)
    unAuthed: boolean; // ? so you can register / login using the same client
}