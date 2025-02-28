import { create } from "zustand";
import { useAPIStore } from "../Stores.tsx";
import Logger from "@/utils/Logger.ts";
import FlagFields from "@/utils/FlagFields.ts";
import safePromise from "@/utils/safePromise.ts";
import { BaseError, isErrorResponse } from "@/types/http/error.ts";

export interface User {
	id: string;
	email: string | null;
	emailVerified: boolean;
	username: string;
	globalNickname: string | null;
	tag: string;
	avatar: string | null;
	publicFlags: string;
	flags: string;
	phoneNumber: string | null;
	mfaEnabled: boolean;
	mfaVerified: boolean;
	bio: string | null;
	shortBio: string | null;
	isClient: boolean;
	isSystem: boolean;
	isGhost: boolean;
	isBot: boolean;
	defaultAvatar: string;
	metaData: {
		/**
		 * The user has no bio, do not make a API request (only set after initial fetch)
		 */
		bioless: boolean;
		/**
		 * The last time we fetched, every hour the cache is invalidated
		 */
		lastFetch?: number;
	};
	mutualFriends?: string[];
	mutualHubs?: string[];
}

export interface UpdateUser {
	username?: string;
	avatar?: string | null;
	bio?: string | null;
	globalNickname?: string | null;
	phoneNumber?: string | null;
	email?: string;
	tag?: string;
	password?: string;
	newPassword?: string;
	shortBio?: string | null;
}

interface ImageOptions {
	size: number;
	format: "webp" | "png" | "jpeg";
}

export interface UserStore {
	users: User[];
	addUser(user: Partial<User>): void;
	removeUser(id: string): void;
	getUser(id: string): User | null;
	getCurrentUser(): User | null;
	getDefaultAvatar(id: string): string;
	fetchUser(id: string, ignoreCache?: boolean): Promise<User | null>;
	isStaff(id: string): boolean;
	patchUser(user: UpdateUser): Promise<{
		success: boolean;
		errors: {
			username: boolean;
			avatar: boolean;
			bio: boolean;
			globalNickname: boolean;
			phoneNumber: boolean;
			email: boolean;
			tag: boolean;
			password: boolean;
			newPassword: boolean;
			unknown: {
				[key: string]: BaseError;
			};
		};
	}>;
	updateUser(user: Partial<User>): void;
	getAvatarUrl(userId: string, hash: string | null, options?: ImageOptions): string | null;
	fetchProfile(userId: string): Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
	users: [],
	addUser: (user) => {
		const currentUsers = get().users;

		const foundUser = currentUsers.find((currentUser) => currentUser.id === user.id) ?? {};

		set({
			users: [
				...currentUsers.filter((currentUser) => currentUser.id !== user.id),
				{
					...{
						avatar: null,
						bio: null,
						shortBio: null,
						email: null,
						emailVerified: false,
						flags: "0",
						globalNickname: null,
						id: "",
						isClient: false,
						mfaEnabled: false,
						mfaVerified: false,
						isGhost: true,
						phoneNumber: null,
						publicFlags: "0",
						tag: "0000",
						username: "Unknown User",
						isBot: false,
						isSystem: false,
						defaultAvatar: get().getDefaultAvatar(user.id ?? "0"),
						metaData: {
							bioless: false,
						},
						mutualFriends: [],
						mutualHubs: [],
					},
					...foundUser,
					...user,
				},
			],
		});
	},
	getCurrentUser: () => {
		const foundCurrentUser = get().users.find((user) => user.isClient);

		if (!foundCurrentUser) {
			Logger.error("No current user found. Possibly an issue.", "UserStore | getCurrentUser()");

			return null;
		}

		return foundCurrentUser;
	},
	getUser: (id) => {
		const foundUser = get().users.find((user) => user.id === id);

		if (foundUser) return foundUser;

		return null;
	},
	fetchUser: async (userId, ignoreCache) => {
		if (!ignoreCache) {
			const foundUser = get().getUser(userId);

			if (foundUser) return foundUser;
		}

		const api = useAPIStore.getState().api;

		if (!api) {
			throw new Error("Failed to get API");
		}

		const [request, error] = await safePromise(api.get<unknown, User>(`/users/${userId}`));

		if (error || !request || request.status === 500) {
			return null;
		}

		get().addUser(request.body);

		return request.body;
	},
	removeUser: (id) => set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
	getDefaultAvatar: (id) => `/icon-${BigInt(id) % 5n}.png`,
	isStaff: (id) => {
		const user = get().getUser(id);

		if (!user) return false;

		const flags = new FlagFields(user.flags, user.publicFlags);

		return flags.has("StaffBadge") || flags.has("Staff");
	},
	patchUser: async (user) => {
		const api = useAPIStore.getState().api;

		if (!api) {
			throw new Error("Failed to get API");
		}

		const [request, error] = await safePromise(
			api.patch<UpdateUser, UpdateUser>({
				url: "/users/@me",
				data: user,
			}),
		);

		if (error || !request || request.status === 500) {
			return {
				success: false,
				errors: {
					avatar: false,
					bio: false,
					email: false,
					globalNickname: false,
					newPassword: false,
					password: false,
					phoneNumber: false,
					tag: false,
					username: false,
					unknown: {},
				},
			};
		}

		if (
			isErrorResponse<{
				user: {
					code: "PasswordRequired" | "InvalidPassword" | "NothingToUpdate";
					message: string;
				};
				username: {
					code: "MaxUsernames";
					message: string;
				};
				tag: {
					code: "TagInUse";
					message: string;
				};
				email: {
					code: "InvalidEmail";
					message: string;
				};
				bio: {
					code: "InvalidType"; // ? invalid type = too long of bio or wrong type (i.e boolean instead of string)
					message: string;
				};
				avatar: {
					code: "InvalidBase64" | "TooLarge";
					message: string;
				};
			}>(request.body)
		) {
			return {
				success: false,
				errors: {
					avatar:
						request.body.errors.avatar?.code === "InvalidBase64" || request.body.errors.avatar?.code === "TooLarge",
					bio: request.body.errors.bio?.code === "InvalidType",
					email: request.body.errors.email?.code === "InvalidEmail",
					globalNickname: false,
					newPassword: false,
					password: request.body.errors.user?.code === "InvalidPassword",
					phoneNumber: false,
					tag: request.body.errors.tag?.code === "TagInUse",
					username: request.body.errors.username?.code === "MaxUsernames",
					unknown: Object.fromEntries(
						Object.entries(request.body.errors).filter(
							([, error]) =>
								error.code !== "InvalidEmail" &&
								error.code !== "InvalidPassword" &&
								error.code !== "MaxUsernames" &&
								error.code !== "TagInUse" &&
								error.code !== "InvalidType" &&
								error.code !== "InvalidBase64" &&
								error.code !== "TooLarge",
						),
					),
				},
			};
		}

		get().updateUser(request.body);

		return {
			success: true,
			errors: {
				avatar: false,
				bio: false,
				email: false,
				globalNickname: false,
				newPassword: false,
				password: false,
				phoneNumber: false,
				tag: false,
				username: false,
				unknown: {},
			},
		};
	},
	updateUser: (user) => {
		const gotUser = get().getUser(user?.id ?? "");

		if (!gotUser) {
			Logger.error("Failed to get user", "UserStore | updateUser()");
			return;
		}

		const newUser = {
			...gotUser,
			...user,
		};

		set({
			users: [...get().users.filter((currentUser) => currentUser.id !== user.id), newUser],
		});
	},
	getAvatarUrl: (userId, hash, options = { format: "webp", size: 256 }) =>
		hash
			? `${import.meta.env.VITE_CDN_URL}/avatar/${userId}/${hash}?size=${options.size}&format=${options.format}`
			: null,
	fetchProfile: async (userId) => {
		const user = get().getUser(userId);

		if (!user) {
			Logger.error("Failed to get user", "UserStore | fetchProfile()");

			return;
		}

		if (Date.now() - (user.metaData.lastFetch ?? 0) < 3600000) {
			// 1 hour
			return;
		}

		const api = useAPIStore.getState().api;

		const profile = await api.get<
			unknown,
			{
				// TODO: Add connections (Discord, Twitter (X), Github, Steam, Spotify (Not sure if we can do this one), Reddit, Youtube, Twitch)
				bio: string | null;
				shortBio: string | null;
				connections: unknown[];
				mutualFriends: string[];
				mutualHubs: string[];
			}
		>({
			url: `/users/${userId}/profile`,
		});

		if (profile.ok && profile.status === 200) {
			get().updateUser({
				bio: profile.body.bio,
				shortBio: profile.body.shortBio,
				id: userId,
				metaData: {
					bioless: typeof profile.body.bio !== "string",
					lastFetch: Date.now(),
				},
				mutualFriends: profile.body.mutualFriends,
				mutualHubs: profile.body.mutualHubs,
			});

			return;
		}

		Logger.error("Failed to fetch profile", "UserStore | fetchProfile()");
	},
}));
