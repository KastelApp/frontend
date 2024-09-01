import { relationshipFlags } from "@/utils/Constants.ts";
import { create } from "zustand";

export interface Relationship {
	relationshipId: string;
	relationshipFlags: number;
	createdAt: string;
	userId: string;
	nickname: string | null;
	pending: boolean;
}

export interface RelationshipsStore {
	relationships: Relationship[];
	addRelationship(relationship: Relationship): void;
	removeRelationship(relationshipId: string): void;
	getRelationship(relationshipId: string): Relationship | undefined;
	getRelationships(userId: string): Relationship[];
	getBlockedRelationships(): Relationship[];
	getPendingRelationships(): Relationship[];
	getFriendRelationships(): Relationship[];
}

export const useRelationshipsStore = create<RelationshipsStore>((set, get) => ({
	relationships: [],
	addRelationship: (relationship) => {
		const currentRelationships = get().relationships;

		const foundRelationship =
			currentRelationships.find(
				(currentRelationship) => currentRelationship.relationshipId === relationship.relationshipId,
			) ?? {};

		set({
			relationships: [
				...currentRelationships.filter(
					(currentRelationship) => currentRelationship.relationshipId !== relationship.relationshipId,
				),
				{
					...foundRelationship,
					...relationship,
				},
			],
		});
	},
	removeRelationship: (relationshipId) =>
		set({
			relationships: get().relationships.filter((relationship) => relationship.relationshipId !== relationshipId),
		}),
	getRelationship: (relationshipId) =>
		get().relationships.find((relationship) => relationship.relationshipId === relationshipId),
	getRelationships: (userId) => get().relationships.filter((relationship) => relationship.userId === userId),
	getBlockedRelationships: () =>
		get().relationships.filter((relationship) => relationship.relationshipFlags === relationshipFlags.Blocked),
	getPendingRelationships: () =>
		get().relationships.filter(
			(relationship) => relationship.pending || relationship.relationshipFlags === relationshipFlags.FriendRequest,
		),
	getFriendRelationships: () =>
		get().relationships.filter(
			(relationship) => !relationship.pending && relationship.relationshipFlags === relationshipFlags.Friend,
		),
}));
