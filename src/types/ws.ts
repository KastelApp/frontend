export type encoding = "json" | "zlib";

export type status =
	| "Connected"
	| "Connecting"
	| "Disconnected"
	| "Offline"
	| "Reconnecting"
	| "Resuming"
	| "UnRecoverable" // ! When we have hit max attempts or something else has happened
	| "UnAuthed"
	| "Ready"; // ? Difference between "Connected" and "Ready" is we have authenticated with the gateway

export interface WebsocketSettings {
	compress: boolean;
	encoding: encoding;
	url: string;
	version: string;
}
