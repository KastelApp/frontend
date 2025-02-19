import { BaseError } from "../http/error.ts";
import { CreateHubOptions } from "../http/hubs/createHub.ts";
import { RequestFail, RequestSuccess } from "./FailSuccess.ts";

interface HubCreateSuccess extends RequestSuccess {
	hub: CreateHubOptions;
}

interface HubCreateFail extends RequestFail {
	errors: {
		unknown: {
			[key: string]: BaseError;
		};
		maxHubsReached: boolean;
		invalidName: boolean;
	};
}

export type HubCreateResponse = HubCreateSuccess | HubCreateFail;
