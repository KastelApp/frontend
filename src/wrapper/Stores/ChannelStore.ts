import { create } from "zustand";
import { useAPIStore } from "../Stores.tsx";
import { useUserStore } from "./UserStore.ts";
import { useMemberStore } from "./Members.ts";
import { useRoleStore } from "./RoleStore.ts";
import PermissionHandler from "../PermissionHandler.ts";
import Logger from "@/utils/Logger.ts";
import { channelTypes } from "@/data/constants.ts";
import { persist } from "zustand/middleware";
import deepMerge from "@/utils/deepMerge.ts";

export interface PermissionOverrides {
	[key: string]: PermissionOverride;
}

export interface PermissionOverride {
	allow: [string, string][];
	deny: [string, string][];
	slowmode: number;
	type: number;
}

export interface Channel {
	hubId: string;
	name: string;
	description: string | null;
	id: string;
	parentId: string | null;
	ageRestricted: boolean;
	slowmode: number;
	type: number;
	children: string[];
	permissionOverrides: PermissionOverrides;
	position: number;
	lastMessageId: string | null;
}

export interface CustomChannel extends Channel {
	channels?: Channel[];
}

export interface ChannelStore {
	channels: Channel[];
	addChannel(channel: Partial<Channel>): void;
	removeChannel(id: string): void;
	fetchChannel(id: string): Promise<Channel | undefined>;
	getChannel(id: string): Channel | undefined;
	getChannels(hubId: string): Channel[];
	getChannelsWithValidPermissions(hubId: string): Channel[];
	getTopChannel(hubId: string): Channel | undefined;
	getSortedChannels(hubId: string, permissionCheck?: boolean): Channel[];
	sendTyping(hubId: string, channelId: string): void;
	getHubId(channelId: string): string | undefined;
	editChannel(channelId: string, data: Partial<Channel>): void;
}

export interface PerChannel {
	/**
	 * default - The user is not editing or replying to a message
	 * editing - The user is editing a message
	 * replying - The user is replying to a message
	 * jumped - The user has jumped to a message (after a few seconds this defaults to default)
	 */
	currentStates: ("editing" | "replying" | "jumped")[];
	/**
	 * The message id of the message you are replying to or editing
	 */
	editingStateId: string | null;
	/**
	 * The message id of the message you are replying to or editing
	 */
	replyingStateId: string | null;
	jumpingStateId: string | null;
	/**
	 * The position of the scroll bar, used for switching channels and staying at the same position
	 */
	scrollPosition: number;
	/**
	 * The last time the user typed
	 */
	lastTyped: number;
	/**
	 * The date the last typing event was sent
	 */
	lastTypingSent: number;
	/**
	 * When the user started typing
	 */
	typingStarted: number;

	fetchingInfo: {
		/**
		 * If there's more on top
		 */
		hasMoreAfter: boolean;
		/**
		 * If there's more on bottom
		 */
		hasMoreBefore: boolean;
		/**
		 * If there was an error fetching data
		 */
		fetchingError: boolean;
		/**
		 * If we've already fetched the initial data.
		 */
		fetchedInitial: boolean;

		/**
		 * The id's
		 */
		renderedItems: string[];

		scrollPosition: number;
	};

	/**
	 * The user's who are currently typing
	 */
	typingUsers: {
		id: string;
		started: number;
	}[];
}

export type RecursivePartial<T> = {
	[P in keyof T]?: RecursivePartial<T[P]>;
};

export interface PerChannelStore {
	channels: {
		[key: string]: PerChannel;
	};
	getChannel(channelId: string): PerChannel;
	addChannel(channelId: string): void;
	removeChannel(channelId: string): void;
	updateChannel(channelId: string, data: RecursivePartial<PerChannel>): void;
}

export interface ContentStore {
	channels: {
		[key: string]: string;
	};
	getContent(channelId: string): string;
	setContent(channelId: string, content: string): void;
}

export const useContentStore = create(
	persist<ContentStore>(
		(set, get) => ({
			channels: {},
			getContent: (channelId) => get().channels[channelId] ?? "",
			setContent: (channelId, content) => set({ channels: { ...get().channels, [channelId]: content } }),
		}),
		{ name: "content" },
	),
);

export const useChannelStore = create<ChannelStore>((set, get) => ({
	channels: [],
	addChannel: (channel) => {
		const currentChannels = get().channels;

		const foundChannel = currentChannels.find((currentChannel) => currentChannel.id === channel.id) ?? { id: null };

		if (channel.name) channel.name = channel.name.trim() || "unknown";

		set({
			channels: [
				...currentChannels.filter((channel) => channel.id !== foundChannel?.id),
				{
					...foundChannel,
					...channel,
				} as Channel,
			],
		});
	},
	removeChannel: (id) => set({ channels: get().channels.filter((channel) => channel.id !== id) }),
	fetchChannel: async (id) => {
		const channel = get().channels.find((channel) => channel.id === id);

		if (channel) return channel;

		const api = useAPIStore.getState().api;

		if (!api) return;

		console.log("FETCH", api);
	},
	getChannels: (hubId) => get().channels.filter((channel) => channel.hubId === hubId),
	getChannelsWithValidPermissions: (hubId) => {
		const clientUser = useUserStore.getState().getCurrentUser();

		if (!clientUser) {
			Logger.warn("No client user found", "ChannelStore | getChannelsWithValidPermissions");

			return [];
		}

		const hubMember = useMemberStore.getState().getMember(hubId, clientUser.id);
		const roles = useRoleStore.getState().getRoles(hubId);
		const channels = get().channels.filter((channel) => channel.hubId === hubId);

		// console.log(hubMember, new Error())

		if (!hubMember || !roles) {
			Logger.warn("No hub member or roles found", "ChannelStore | getChannelsWithValidPermissions");

			return [];
		}

		const permissionHandler = new PermissionHandler(
			clientUser.id,
			hubMember.owner,
			hubMember.roles.map((roleId) => roles.find((role) => role.id === roleId)!).filter(Boolean),
			channels,
		);

		return channels.filter((channel) => permissionHandler.hasChannelPermission(channel.id, ["ViewMessageHistory"]));
	},
	getTopChannel: (hubId) => {
		const channels = get().getChannelsWithValidPermissions(hubId);

		const topChannel = channels
			.filter((channel) =>
				[
					channelTypes.HubMarkdown,
					channelTypes.HubNewMember,
					channelTypes.HubNews,
					channelTypes.HubRules,
					channelTypes.HubText,
				].includes(channel.type),
			)
			.sort((a, b) => a.position - b.position)[0];

		return topChannel;
	},
	getSortedChannels: (hubId, permissionCheck) => {
		const baseChannels = permissionCheck ? get().getChannelsWithValidPermissions(hubId) : get().getChannels(hubId);

		const rawSortedChannels: CustomChannel[] = [];

		const parentlessChannels = baseChannels.filter(
			(channel) => !channel.parentId && channel.type !== channelTypes.HubCategory,
		);

		for (const channel of parentlessChannels) {
			rawSortedChannels.push({
				...channel,
				channels: [],
			});
		}

		const categoryChannels = baseChannels.filter((channel) => channel.type === channelTypes.HubCategory);

		for (const category of categoryChannels) {
			const categoryChannels = baseChannels.filter((channel) => channel.parentId === category.id);

			rawSortedChannels.push({
				...category,
				channels: categoryChannels.sort((a, b) => a.position - b.position),
			});
		}

		const parentsOnly = rawSortedChannels
			.filter((channel) => channel.type === channelTypes.HubCategory)
			.sort((a, b) => a.position - b.position);

		const sortedParentlessChannels = rawSortedChannels
			.filter((channel) => !channel.parentId && channel.type !== channelTypes.HubCategory)
			.sort((a, b) => a.position - b.position);

		// ? now we sort it back to a single array. That is: [parentless, parentless, parent, child, child, parent, parent, child, child]
		// ? the double parent is an example of a case where a parent has no children
		const sortedChannels = [...(sortedParentlessChannels as Channel[])];

		for (const parent of parentsOnly) {
			const children = parent.channels;

			delete parent.channels;

			sortedChannels.push(parent);

			sortedChannels.push(...children!);
		}

		return sortedChannels;
	},
	sendTyping: (hubId, channelId) => {
		// ? We use `getChannelsWithValidPermissions` just so we don't have to check permissions our self
		// ? Since if the channel does not exist we don't even make a API call
		const channel = get()
			.getChannelsWithValidPermissions(hubId)
			.find((channel) => channel.id === channelId);

		if (!channel) return;

		const perChannel = usePerChannelStore.getState().getChannel(channelId);

		if (Date.now() - perChannel.lastTypingSent < 5000) return;

		useAPIStore.getState().api.post(`/channels/${channelId}/typing`).catch(console.error);

		usePerChannelStore.getState().updateChannel(channelId, { lastTypingSent: Date.now() });
	},
	getHubId: (channelId) => {
		const channel = get().channels.find((channel) => channel.id === channelId);

		return channel?.hubId;
	},
	getChannel: (id) => get().channels.find((channel) => channel.id === id),
	editChannel: (channelId, data) => {
		const currentChannels = get().channels;

		const channel = currentChannels.find((channel) => channel.id === channelId);

		if (!channel) return;

		const editedChannel = deepMerge({ ...channel }, { ...data });

		set({
			channels: [...currentChannels.filter((channel) => channel.id !== channelId), editedChannel],
		});
	}
}));

export const usePerChannelStore = create<PerChannelStore>((set, get) => ({
	channels: {},
	getChannel: (channelId) => {
		return {
			...({
				currentStates: [],
				lastTyped: 0,
				lastTypingSent: 0,
				scrollPosition: 0,
				editingStateId: null,
				replyingStateId: null,
				typingUsers: [],
				jumpingStateId: null,
				typingStarted: 0,
				fetchingInfo: {
					fetchedInitial: false,
					fetchingError: false,
					hasMoreAfter: false,
					hasMoreBefore: false,
					renderedItems: [],
					scrollPosition: 0
				}
			} satisfies PerChannel),
			...get().channels[channelId],
		};
	},
	addChannel: (channelId) => {
		set({
			channels: {
				...get().channels,
				[channelId]: {
					currentStates: [],
					scrollPosition: 0,
					lastTyped: 0,
					lastTypingSent: 0,
					fetchingInfo: {
						fetchedInitial: false,
						fetchingError: false,
						hasMoreAfter: false,
						hasMoreBefore: false,
						renderedItems: [],
						scrollPosition: 0
					},
					editingStateId: null,
					replyingStateId: null,
					typingUsers: [],
					jumpingStateId: null,
					typingStarted: 0,
				},
			},
		});
	},
	removeChannel: (channelId) => {
		const channels = get().channels;

		delete channels[channelId];

		set({ channels });
	},
	updateChannel: (channelId, data) => {
		const base: PerChannel = {
			currentStates: [],
			lastTyped: 0,
			lastTypingSent: 0,
			scrollPosition: 0,
			fetchingInfo: {
				fetchedInitial: false,
				fetchingError: false,
				hasMoreAfter: false,
				hasMoreBefore: false,
				renderedItems: [],
				scrollPosition: 0,
			},
			editingStateId: null,
			replyingStateId: null,
			typingUsers: [],
			jumpingStateId: null,
			typingStarted: 0,
		};

		const channel = get().getChannel(channelId) ?? base;

		// ? de-dupe the states
		const currentStates = data.currentStates
			? Array.from(new Set([...data.currentStates]))
			: Array.from(new Set([...channel.currentStates]));

		// Deep merge the data object with the existing channel state
		const mergedData = deepMerge({ ...channel }, { ...data });

		set({
			channels: {
				...get().channels,
				[channelId]: {
					...base,
					...mergedData,
					currentStates,
				} as PerChannel,
			},
		});
	},
}));
