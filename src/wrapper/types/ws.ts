export type encoding = "json";

export type status =
	| "Connected"
	| "Connecting"
	| "Disconnected"
    | "Offline"
    | "Reconnecting"
    | "Resuming"
    | "Ready"; // ? Difference between "Connected" and "Ready" is we have authenticated with the gateway

export interface websocketSettings {
	compress: boolean;
	// only json is supported for now
	encoding: encoding;
	url: string;
	version: string;
}