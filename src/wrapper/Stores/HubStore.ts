import { create } from "zustand";
import { useAPIStore } from "../Stores.tsx";

// ? We do not provide channels, roles or members as they got their own stores
export interface Hub {
	name: string;
	description: string | null;
	features: string[];
	id: string;
	icon: string | null;
	ownerId: string | null;
	coOwners: string[];
	maxMembers: number;
	flags: number;
	unavailable: boolean;
	channelProperties: {
		channelId: string;
		lastMessageAckId: string | null;
		timedoutUntil: string | null;
		mentions: { messageId: string }[];
	}[];
	memberCount: number;
	partial?: boolean;
}

export interface HubStore {
	hubs: Hub[];
	addHub(hub: Partial<Hub>, partialIfNotFound?: boolean): void;
	removeHub(id: string): void;
	// ? This isn't a promise due to the fact that we have no reason to fetch a hub via the api
	getHub(id: string): Hub | undefined;
	updateReadState(hubId: string, channelId: string, lastMessageAckId: string): void;
}

export const useHubStore = create<HubStore>((set, get) => ({
	hubs: [],
	addHub: (hub, partialIfNotFound) => {
		const currentHubs = get().hubs;
		let hubUpdated = false;

		if (hub.name) hub.name = hub.name.trim() || "Unknown";

		const updatedHubs = currentHubs.map((currentHub) => {
			if (currentHub.id === hub.id) {
				hubUpdated = true;
				return { ...currentHub, ...hub } as Hub;
			}
			return currentHub;
		});

		if (!hubUpdated) {
			if (partialIfNotFound) {
				hub.partial = true;
			}

			updatedHubs.push(hub as Hub);
		}

		set({
			hubs: updatedHubs,
		});
	},
	removeHub: (id) => set({ hubs: get().hubs.filter((hub) => hub.id !== id) }),
	getHub: (id) =>
		get().hubs.find((hub) => hub.id === id) ?? {
			name: "Unknown",
			description: null,
			features: [],
			id: id,
			icon: null,
			ownerId: null,
			coOwners: [],
			maxMembers: 0,
			flags: 0,
			unavailable: true,
			channelProperties: [],
			memberCount: 0,
		},
	updateReadState: async (hubId, channelId, lastMessageAckId) => {
		const hub = get().getHub(hubId);

		if (!hub) return;

		const channel = hub.channelProperties.find((channel) => channel.channelId === channelId);

		if (!channel) return;

		useAPIStore.getState().api.post(`/channels/${channelId}/ack`).catch(console.error);

		set({
			hubs: get().hubs.map((currentHub) => {
				if (currentHub.id === hubId) {
					return {
						...currentHub,
						channelProperties: currentHub.channelProperties.map((currentChannel) => {
							if (currentChannel.channelId === channelId) {
								return {
									...currentChannel,
									lastMessageAckId,
								};
							}

							return currentChannel;
						}),
					};
				}

				return currentHub;
			}),
		});
	},
}));
