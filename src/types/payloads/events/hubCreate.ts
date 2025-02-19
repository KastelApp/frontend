import { Hub } from "../ready.ts";

export interface HubCreatePayload extends Hub {
	ownerId: string;
	coOwnerIds: string[];
}
