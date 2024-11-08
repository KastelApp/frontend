/* eslint-disable import/no-anonymous-default-export */

import Snowflake from "@/utils/Snowflake.ts";

const settings = {
	maxMessageSize: 2000,
	maxUsernameLength: 32,
	maxNicknameLength: 32,
	maxHubNameLength: 100,
	maxChannelNameLength: 100,
	maxRoleNameLength: 100,
};

export enum HubFeatures {
	Partnered = "Partnered",
	Verified = "Verified",
	Official = "Official",
	Maintenance = "Maintenance",
}

export enum WebSocketErrorCodes {
	UnknownError = 4000,
	InvalidToken = 4001,
	AccountUnAvailable = 4002,
	InvalidOpCode = 4003,
	InvalidPayload = 1007,
	InternalServerError = 1011,
	Unauthorized = 4004,
	AlreadyAuthorized = 4005,
	InvalidSequence = 4006,
	HeartbeatTimeout = 4007,
	InvalidVersion = 4008,
	InvalidEncoding = 4009,
  }
  

const allowedMentions: {
	All?: number;
	Everyone: number;
	Here: number;
	Roles: number;
	Users: number;
} = {
	Everyone: 1 << 5,
	Here: 1 << 6,
	Roles: 1 << 7,
	Users: 1 << 8,
};

allowedMentions.All = allowedMentions.Everyone | allowedMentions.Here | allowedMentions.Roles | allowedMentions.Users;

const hubMemberFlags = {
	Left: 1 << 0,
	In: 1 << 1,
	Kicked: 1 << 2,
	Banned: 1 << 3,
	Owner: 1 << 4,
	CoOwner: 1 << 5,
};

const channelTypes = {
	HubCategory: 1 << 0,
	HubText: 1 << 1,
	HubNews: 1 << 2,
	HubRules: 1 << 3,
	HubVoice: 1 << 4,
	HubNewMember: 1 << 5,
	HubMarkdown: 1 << 6,
	Dm: 1 << 10,
	GroupChat: 1 << 11,
};

const presenceTypes = {
	custom: 0,
	playing: 1,
	watching: 2,
	listening: 3,
	streaming: 4,
};

const statusTypes = {
	// ? can only have one at a time besides if you are offline, so if you are offline you can have 1 << 1 | 1 << 2 which means, you are offline but your are idle
	offline: 1 << 0,
	online: 1 << 1,
	idle: 1 << 2,
	dnd: 1 << 3,
	invisible: 1 << 4,
};

const messageFlags = {
	System: 1 << 0,
	Normal: 1 << 1,
	Phishing: 1 << 5, // ? when a domain is detected as phishing, (This is only for link shortnered links)
};

const inviteFlags = {
	Normal: 1 << 0, // invite for a hub channel
	GroupChat: 1 << 1, // invite for a gdm
	FriendLink: 1 << 2, // This lets you "add" a friend rather then having them send you a friend request, this is an instant friend
	Vanity: 1 << 3, // This is a vanity invite (like kastelapp.com/invite/kastel) Undeleatable 1 per hub
};

const publicFlags = {
	StaffBadge: 1n << 0n,
	GhostBadge: 1n << 1n,
	SponsorBadge: 1n << 2n,
	DeveloperBadge: 1n << 3n,
	VerifiedBotDeveloperBadge: 1n << 4n,
	OriginalUserBadge: 1n << 5n,
	PartnerBadge: 1n << 6n,
	ModeratorBadge: 1n << 7n,
	BugHunterLevel1: 1n << 8n,
	BugHunterLevel2: 1n << 9n,
	BugHunterLevel3: 1n << 10n,
};

const badgeOrder = [
	publicFlags.StaffBadge,
	publicFlags.PartnerBadge,
	publicFlags.ModeratorBadge,
	publicFlags.BugHunterLevel1,
	publicFlags.BugHunterLevel2,
	publicFlags.BugHunterLevel3,
	publicFlags.DeveloperBadge,
	publicFlags.VerifiedBotDeveloperBadge,
	publicFlags.SponsorBadge,
];

const privateFlags = {
	Ghost: 1n << 0n,
	System: 1n << 1n,
	Staff: 1n << 2n,
	Bot: 1n << 4n,
	VerifiedBot: 1n << 5n,
	Spammer: 1n << 6n,
};

const permissions = {
	Administrator: {
		int: 1n << 0n,
		group: "role", // ? Groups = role, channel, both. role = Permissions only supported for a role (and not a channel permission override) channel = Permissions only supported for a channel (and not a role) both = Permissions supported for both
		subPermissions: {
			Administrator: 0n,
		}, // ? It has them all already
	},
	Hub: {
		int: 1n << 1n,
		group: "role",
		subPermissions: {
			ManageHubName: 1n << 0n,
			ManageHubDescription: 1n << 1n,
			ManageHubIcon: 1n << 2n,
			ToggleMaintenance: 1n << 3n,
			AddBots: 1n << 4n,
			ViewAuditLog: 1n << 5n,
			ManageVanity: 1n << 6n,
		},
	},
	Roles: {
		int: 1n << 2n,
		group: "role",
		subPermissions: {
			ManageRoleName: 1n << 0n,
			ManageRoleColor: 1n << 1n,
			ManageRolePosition: 1n << 2n,
			ManageRolePermissions: 1n << 3n,
			CreateRole: 1n << 4n,
			DeleteRole: 1n << 5n
		},
	},
	Channels: {
		int: 1n << 3n,
		group: "both",
		subPermissions: {
			ManageChannelName: 1n << 0n,
			ManageChannelPosition: 1n << 1n,
			ManageChannelTopic: 1n << 2n,
			ManageChannelSlowmode: 1n << 3n, // ? This doesn't count for the per role slowmode, rather for global
			ManageChannelAgeRestriction: 1n << 4n,
			ManageChannelInvites: 1n << 5n, // ? If you can view / delete invites
			ManageChannelWebhooks: 1n << 6n, // ? If you can view / delete webhooks
			CreateChannel: 1n << 7n,
			ManageChannelPermissionOverrides: 1n << 8n, // ? lets you manage permission overrides
			DeleteChannel: 1n << 9n, // ? If you can delete channels (or the channel (permission override))
			ViewChannels: 1n << 10n,
			ViewMessageHistory: 1n << 11n,
			SendMessages: 1n << 12n,
			EmbedLinks: 1n << 13n,
			AttachFiles: 1n << 14n,
			AddReactions: 1n << 15n,
			UseExternalEmojis: 1n << 17n,
			UseChatFormatting: 1n << 18n, // ? i.e markdown, and default emojis
			ManageMessages: 1n << 19n,
			BypassSlowmode: 1n << 20n,
		},
	},
	Members: {
		int: 1n << 4n,
		group: "role",
		subPermissions: {
			ManageMemberRoles: 1n << 0n,
			MemberDeafen: 1n << 1n,
			MemberMove: 1n << 2n,
			MemberVoice: 1n << 3n,
			CanMentionRoles: 1n << 4n, // ? if you can mention any role even if its not mentionable excluding @everyone and @here
			CanMentionEveryone: 1n << 5n, // ? if you can mention @everyone and @here
		},
	},
	Emojis: {
		int: 1n << 5n,
		group: "role",
		subPermissions: {
			ManageEmojiName: 1n << 0n,
			ManageEmojiImage: 1n << 1n,
			CreateEmoji: 1n << 2n,
			DeleteEmoji: 1n << 3n,
		},
	},
	Moderation: {
		int: 1n << 6n,
		group: "role",
		subPermissions: {
			BanMembers: 1n << 0n,
			UnbanMembers: 1n << 1n,
			ViewBans: 1n << 2n,
			KickMembers: 1n << 3n,
			TimeoutMembers: 1n << 4n,
		},
	},
	ManageNicknames: {
		int: 1n << 7n,
		group: "role",
		subPermissions: {
			Nickname: 1n << 0n, // ? you can change your own nickname
			ManageNickname: 1n << 1n, // ? you can change other peoples nicknames
		},
	},
	ManageInvites: {
		int: 1n << 8n,
		group: "role",
		subPermissions: {
			CreateInvite: 1n << 0n,
			DeleteInvite: 1n << 1n,
			ViewInvites: 1n << 2n,
		},
	},
} satisfies {
	[key: string]: {
		group: "both" | "channel" | "role";
		int: bigint;
		subPermissions: {
			[key: string]: bigint;
		};
	};
};

const relationshipFlags = {
	None: 1 << 0,
	Blocked: 1 << 1,
	FriendRequest: 1 << 2,
	Friend: 1 << 3,
	MutualFriend: 1 << 4,
};

const snowflakeOptions = {
	Epoch: 1_701_410_400_000n,
	TimeShift: 22n,
	WorkerIdBytes: 17n,
	ProcessIdBytes: 12n,
	WorkerId: 1n,
	ProcessId: 1n,
};

const permissionOverrideTypes = {
	Role: 1 << 0,
	Member: 1 << 1,
	Everyone: 1 << 2,
};

const opCodes = {
	event: 0, // ? dispatched events, i.e "ChannelCreate"
	identify: 1,
	ready: 2,
	heartbeat: 3,
	presenceUpdate: 4,
	// ? When a hub gets large enough, we do not want to continuously send the entire hub to the client, so when the client starts up the hub will appear as "unavailable"
	// ? Then if the user clicks on the hub, we'll request the hub data, Upsides to this is less memory usage for large hubs, downside to this is when the user clicks on the hub, there will be a slight delay before the hub is loaded
	// ? Soution to that is possibly store (client side) hubs they access actively, and if one of the hubs is unavailable, we'll request the hub data in the background on startup
	requestHub: 5,
	// ? Like discords, once the hub gets enough members you'll only receive the top 200 members, then as you scroll down it requests more members
	requestHubMembers: 6,
	resume: 7,
	heartbeatAck: 8,
	hello: 9,
} as const;

const userSendCodes = [
	// ? these are the codes the client can send
	opCodes.identify,
	opCodes.heartbeat,
	opCodes.presenceUpdate,
	opCodes.requestHub,
	opCodes.requestHubMembers,
	opCodes.resume,
];

const fakeUserIds = {
	kiki: "102652169335591636",
	ghost: "122652169335591636",
};

const snowflake = new Snowflake(
	snowflakeOptions.Epoch,
	snowflakeOptions.WorkerId,
	snowflakeOptions.ProcessId,
	snowflakeOptions.TimeShift,
	snowflakeOptions.WorkerIdBytes,
	snowflakeOptions.ProcessIdBytes,
);

export default {
	allowedMentions,
	channelTypes,
	presenceTypes,
	privateFlags,
	permissions,
	relationshipFlags,
	hubMemberFlags,
	messageFlags,
	publicFlags,
	permissionOverrideTypes,
	inviteFlags,
	statusTypes,
	opCodes,
	userSendCodes,
	snowflakeOptions,
	settings,
	fakeUserIds,
	badgeOrder,
	snowflake,
};

export {
	allowedMentions,
	channelTypes,
	presenceTypes,
	privateFlags,
	permissions,
	relationshipFlags,
	hubMemberFlags,
	messageFlags,
	publicFlags,
	permissionOverrideTypes,
	inviteFlags,
	statusTypes,
	opCodes,
	userSendCodes,
	snowflakeOptions,
	settings,
	fakeUserIds,
	badgeOrder,
	snowflake,
};
