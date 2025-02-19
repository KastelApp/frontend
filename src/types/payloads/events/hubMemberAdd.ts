import { Member } from "../ready.ts";

export interface HubMemberAddPayload extends Member {
	hubId: string;
	userId?: string;
}
