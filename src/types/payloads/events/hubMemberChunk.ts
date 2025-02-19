import { Member } from "../ready.ts";

export interface HubMemberChunkPayload {
	hubId: string;
	members: Member[];
}
