import { BaseError } from "../http/error.ts";
import { SettingsPayload } from "../http/user/settings.ts";
import { RequestFail, RequestSuccess } from "./FailSuccess.ts";

interface SettingsSuccess extends RequestSuccess {
	settings: SettingsPayload;
}

interface SettingsFail extends RequestFail {
	errors: {
		unknown: {
			[key: string]: BaseError;
		};
	};
}

export type SettingsResponse = SettingsSuccess | SettingsFail;
