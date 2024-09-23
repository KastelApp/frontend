import { create } from "zustand";
import { useAPIStore } from "../Stores.tsx";
import safePromise from "@/utils/safePromise.ts";
import { ErrorResponseData } from "@/types/http/error.ts";
import { useGuildStore } from "@/wrapper/Stores/GuildStore.ts";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { inviteFlags } from "@/utils/Constants.ts";

export interface BaseInvite {
	type: number;
	code: string;
	guild: {
		id: string;
		name: string;
		icon: string | null;
		ownerId: string;
		features: string[];
		memberCount: number;
	};
	channel: {
		id: string;
		name: string;
		type: number;
		description: string | null;
	} | null;
	creator: {
		id: string;
		avatar: string | null;
		globalNickname: string;
		username: string;
		tag: string;
		publicFlags: string;
		flags: string;
	} | null;
	uses: number;
	maxUses: number;
	expiresAt: Date | null;
	valid: boolean;
}

export interface Invite {
	type: number;
	code: string;
	guildId: string | null;
	channelId: string | null;
	creatorId: string | null;
	uses: number;
	maxUses: number;
	expiresAt: Date | null;
	banned: boolean;
	valid: boolean;
}

export interface InviteStore {
	invites: Invite[];
	addInvite(invite: Invite): void;
	removeInvite(code: string): void;
	getInvite(code: string): Invite | null;
	joinInvite(code: string): Promise<"MaxGuildsReached" | "Banned" | "AlreadyIn" | "InvalidInvite" | "Success">;
	fetchInvite(code: string): Promise<Invite | null>;
}

export const useInviteStore = create<InviteStore>((set, get) => ({
	invites: [],
	addInvite: (invite) => {
		const currentInvites = get().invites;

		const foundInvite = currentInvites.find((currentInvite) => currentInvite.code === invite.code) ?? {};

		set({
			invites: [
				...currentInvites.filter((currentInvite) => currentInvite.code !== invite.code),
				{
					...foundInvite,
					...invite,
				},
			],
		});
	},
	removeInvite: (code) => set({ invites: get().invites.filter((invite) => invite.code !== code) }),
	getInvite: (code) => get().invites.find((invite) => invite.code === code) ?? null,
	joinInvite: async (code) => {
		const api = useAPIStore.getState().api;

		if (!api) {
			throw new Error("Failed to get API");
		}

		const [res, error] = await safePromise(
			api.post<
				unknown,
				ErrorResponseData<
					BaseInvite,
					{
						guild: {
							code: "MaxGuildsReached" | "Banned" | "AlreadyIn";
							message: string;
						};
						invite: {
							code: "InvalidInvite";
							message: string;
						};
					}
				>
			>({
				url: `/invites/${code}`,
			}),
		);

		if (!res?.body || error) return "InvalidInvite";

		if ("errors" in res.body) {
			// ? If we are banned but the invite is already in the store we can just mark it as banned
			if (res.body.errors.guild.code === "Banned") {
				const invite = get().getInvite(code);

				if (!invite) return "Banned";

				get().addInvite({
					...invite,
					banned: true,
				});

				return "Banned";
			}

			return res.body.errors?.guild?.code ?? res.body.errors?.invite?.code ?? "InvalidInvite";
		}

		// ? we add the partials
		useGuildStore.getState().addGuild(res.body.guild, true);
		if (res.body.channel)
			useChannelStore.getState().addChannel({
				...res.body.channel,
				guildId: res.body.guild.id,
			});

		if (res.body.creator) useUserStore.getState().addUser(res.body.creator);

		get().addInvite({
			type: res.body.type,
			code: res.body.code,
			guildId: res.body.guild.id,
			channelId: res.body.channel?.id ?? null,
			creatorId: res.body.creator?.id ?? "",
			uses: res.body.uses,
			maxUses: res.body.maxUses,
			expiresAt: res.body.expiresAt ? new Date(res.body.expiresAt) : null,
			banned: false,
			valid: true,
		});

		return "Success";
	},
	fetchInvite: async (code) => {
		// ? if its in the store we can just return it
		const invite = get().getInvite(code);

		if (invite) return invite;

		const api = useAPIStore.getState().api;

		if (!api) {
			throw new Error("Failed to get API");
		}

		const [res, error] = await safePromise(
			api.get<
				unknown,
				ErrorResponseData<
					BaseInvite,
					{
						guild: {
							code: "MaxGuildsReached" | "Banned" | "AlreadyIn";
							message: string;
						};
						invite: {
							code: "InvalidInvite";
							message: string;
						};
					}
				>
			>({
				url: `/invites/${code}`,
			}),
		);

		if (!res?.body || error || "errors" in res.body) {
			get().addInvite({
				type: inviteFlags.Normal,
				banned: false,
				channelId: null,
				code,
				creatorId: null,
				expiresAt: null,
				guildId: null,
				maxUses: 0,
				uses: 0,
				valid: false,
			});

			return {
				type: inviteFlags.Normal,
				banned: false,
				channelId: null,
				code,
				creatorId: null,
				expiresAt: null,
				guildId: null,
				maxUses: 0,
				uses: 0,
				valid: false,
			};
		}

		// ? we add the partials

		if (res.body.guild) useGuildStore.getState().addGuild(res.body.guild, true);

		if (res.body.channel)
			useChannelStore.getState().addChannel({
				...res.body.channel,
				guildId: res.body.guild.id,
			});

		if (res.body.creator) useUserStore.getState().addUser(res.body.creator);

		get().addInvite({
			type: res.body.type,
			code: res.body.code,
			guildId: res.body.guild.id,
			channelId: res.body.channel?.id ?? null,
			creatorId: res.body.creator?.id ?? "",
			uses: res.body.uses,
			maxUses: res.body.maxUses,
			expiresAt: res.body.expiresAt ? new Date(res.body.expiresAt) : null,
			banned: false,
			valid: true,
		});

		return {
			type: res.body.type,
			code: res.body.code,
			guildId: res.body.guild.id,
			channelId: res.body.channel?.id ?? null,
			creatorId: res.body.creator?.id ?? "",
			uses: res.body.uses,
			maxUses: res.body.maxUses,
			expiresAt: res.body.expiresAt ? new Date(res.body.expiresAt) : null,
			banned: false,
			valid: true,
		};
	},
}));
