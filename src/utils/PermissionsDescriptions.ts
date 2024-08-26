import { permissions } from "@/utils/Constants.ts";

type PermissionKeys = {
    [K in keyof typeof permissions]: keyof (typeof permissions)[K]["subPermissions"];
};

type PermissionKey = PermissionKeys[keyof PermissionKeys] | "Administrator";

// ? thanks kodarru for the permissions descriptions <3
// todo: translation
const permissionsDescriptions = {
    simple: {
        groups: {
            ManageGuild: {
                permissions: [
                    "ManageGuildName",
                    "ManageGuildDescription",
                    "ManageGuildIcon",
                    "ToggleMaintenance",
                    "AddBots",
                    "ViewAuditLog",
                    "ManageVanity",
                ],
                label: "Manage Guild",
                description: "Allows the user to manage the server, including changing settings and viewing audit logs.",
            },
            ManageRoles: {
                permissions: [
                    "ManageRoleName",
                    "ManageRoleColor",
                    "ManageRolePosition",
                    "ManageRolePermissions",
                    "CreateRole",
                    "DeleteRole",
                ],
                label: "Manage Roles",
                description: "Allows the user to create, delete, and modify roles and their permissions.",
            },
            ManageChannels: {
                permissions: [
                    "ManageChannelName",
                    "ManageChannelPosition",
                    "ManageChannelTopic",
                    "ManageChannelSlowmode",
                    "ManageChannelAgeRestriction",
                    "ManageChannelInvites",
                    "ManageChannelWebhooks",
                    "CreateChannel",
                    "DeleteChannel",
                    "ManageChannelPermissionOverrides",
                ],
                label: "Manage Channels",
                description: "Allows the user to create, delete, and modify channels and their settings.",
            },
            SendMessages: {
                permissions: ["SendMessages"],
                label: "Send Messages",
                description: "Allows the user to send messages.",
            },
            ViewMessageHistory: {
                permissions: ["ViewMessageHistory"],
                label: "View Message History",
                description: "Allows the user to view message history.",
            },
            AddReactions: {
                permissions: ["AddReactions"],
                label: "Add Reactions",
                description: "Allows the user to add reactions to messages.",
            },
            EmbedLinks: {
                permissions: ["EmbedLinks"],
                label: "Embed Links",
                description: "Allows the user to embed links in messages.",
            },
            AttachFiles: {
                permissions: ["AttachFiles"],
                label: "Attach Files",
                description: "Allows the user to attach files in messages.",
            },
            UseExternalEmojis: {
                permissions: ["UseExternalEmojis"],
                label: "Use External Emojis",
                description: "Allows the user to use external emojis in messages.",
            },
            UseChatFormatting: {
                permissions: ["UseChatFormatting"],
                label: "Use Chat Formatting",
                description: "Allows the user to use formatting in chat messages.",
            },
            ManageMessages: {
                permissions: ["ManageMessages"],
                label: "Manage Messages",
                description: "Allows the user to manage messages, including deleting others' messages.",
            },
            BypassSlowmode: {
                permissions: ["BypassSlowmode"],
                label: "Bypass Slowmode",
                description: "Allows the user to bypass channel slowmode settings.",
            },
            ManageBasicMembers: {
                permissions: [
                    "ManageMemberRoles",
                    "TimeoutMembers",
                    "MemberDeafen",
                    "MemberMove",
                    "MemberVoice",
                    "Nickname",
                    "ManageNickname",
                ],
                label: "Manage Basic Members",
                description: "Allows the user to manage basic member settings like roles, mute, and deafen.",
            },
            ModerateMembers: {
                permissions: [
                    "BanMembers",
                    "UnbanMembers",
                    "ViewBans",
                    "KickMembers",
                    "TimeoutMembers",
                ],
                label: "Moderate Members",
                description: "Allows the user to moderate members, including banning, kicking, and timeouts.",
            },
            ManageEmojis: {
                permissions: [
                    "ManageEmojiName",
                    "ManageEmojiImage",
                    "CreateEmoji",
                    "DeleteEmoji",
                ],
                label: "Manage Emojis",
                description: "Allows the user to manage emojis, including uploading and deleting them.",
            },
            ManageInvites: {
                permissions: [
                    "CreateInvite",
                    "DeleteInvite",
                    "ViewInvites",
                ],
                label: "Manage Invites",
                description: "Allows the user to create, delete, and view invites.",
            },
        },
    },
    advanced: {
        groups: {
            ManageGuildName: {
                permissions: ["ManageGuildName"],
                label: "Change Guild Name",
                description:
                    "Allows the user to change the guild name.",
            },
            ManageGuildDescription: {
                permissions: ["ManageGuildDescription"],
                label: "Change Guild Description",
                description:
                    "Allows the user to change the guild description.",
            },
            ManageGuildIcon: {
                permissions: ["ManageGuildIcon"],
                label: "Change Guild Icon",
                description:
                    "Allows the user to change the guild icon.",
            },
            ToggleMaintenance: {
                permissions: ["ToggleMaintenance"],
                label: "Toggle Maintenance",
                description:
                    "Allows the user to toggle maintenance mode.",
            },
            AddBots: {
                permissions: ["AddBots"],
                label: "Add Bots",
                description:
                    "Allows the user to add bots to the guild.",
            },
            ViewAuditLog: {
                permissions: ["ViewAuditLog"],
                label: "View Audit Log",
                description:
                    "Allows the user to view the audit log.",
            },
            ManageVanity: {
                permissions: ["ManageVanity"],
                label: "Manage Vanity",
                description:
                    "Allows the user to manage the guild's vanity URL.",
            },
            RoleName: {
                permissions: ["ManageRoleName"],
                label: "Change Role Name",
                description:
                    "Allows the user to change the name of a role.",
            },
            RoleColor: {
                permissions: ["ManageRoleColor"],
                label: "Change Role Color",
                description:
                    "Allows the user to change the color of a role.",
            },
            RolePosition: {
                permissions: ["ManageRolePosition"],
                label: "Change Role Position",
                description:
                    "Allows the user to change the position of a role.",
            },
            RolePermissions: {
                permissions: ["ManageRolePermissions"],
                label: "Change Role Permissions",
                description:
                    "Allows the user to change the permissions of a role.",
            },
            CreateRole: {
                permissions: ["CreateRole"],
                label: "Create Role",
                description:
                    "Allows the user to create roles.",
            },
            DeleteRole: {
                permissions: ["DeleteRole"],
                label: "Delete Role",
                description:
                    "Allows the user to delete roles.",
            },
            ChannelName: {
                permissions: ["ManageChannelName"],
                label: "Change Channel Name",
                description:
                    "Allows the user to change the name of a channel.",
            },
            ChannelPosition: {
                permissions: ["ManageChannelPosition"],
                label: "Change Channel Position",
                description:
                    "Allows the user to change the position of a channel.",
            },
            ChannelTopic: {
                permissions: ["ManageChannelTopic"],
                label: "Change Channel Topic",
                description:
                    "Allows the user to change the topic of a channel.",
            },
            ChannelSlowmode: {
                permissions: ["ManageChannelSlowmode"],
                label: "Change Channel Slowmode",
                description:
                    "Allows the user to change the slowmode of a channel.",
            },
            ChannelAgeRestriction: {
                permissions: ["ManageChannelAgeRestriction"],
                label: "Change Channel Age Restriction",
                description:
                    "Allows the user to change the age restriction of a channel.",
            },
            ChannelInvites: {
                permissions: ["ManageChannelInvites"],
                label: "Change Channel Invites",
                description:
                    "Allows the user to change the invites of a channel.",
            },
            ChannelWebhooks: {
                permissions: ["ManageChannelWebhooks"],
                label: "Change Channel Webhooks",
                description:
                    "Allows the user to change the webhooks of a channel.",
            },
            CreateChannel: {
                permissions: ["CreateChannel"],
                label: "Create Channel",
                description:
                    "Allows the user to create channels.",
            },
            DeleteChannel: {
                permissions: ["DeleteChannel"],
                label: "Delete Channel",
                description:
                    "Allows the user to delete channels.",
            },
            ManageChannelPermissionOverrides: {
                permissions: ["ManageChannelPermissionOverrides"],
                label: "Manage Channel Permission Overrides",
                description:
                    "Allows the user to manage channel permission overrides.",
            },
            ViewChannels: {
                permissions: ["ViewChannels"],
                label: "View Channels",
                description:
                    "Allows the user to view channels.",
            },
            ViewMessageHistory: {
                permissions: ["ViewMessageHistory"],
                label: "View Message History",
                description:
                    "Allows the user to view message history.",
            },
            SendMessages: {
                permissions: ["SendMessages"],
                label: "Send Messages",
                description:
                    "Allows the user to send messages.",
            },
            EmbedLinks: {
                permissions: ["EmbedLinks"],
                label: "Embed Links",
                description:
                    "Allows the user to embed links.",
            },
            AttachFiles: {
                permissions: ["AttachFiles"],
                label: "Attach Files",
                description:
                    "Allows the user to attach files.",
            },
            AddReactions: {
                permissions: ["AddReactions"],
                label: "Add Reactions",
                description:
                    "Allows the user to add reactions.",
            },
            UseExternalEmojis: {
                permissions: ["UseExternalEmojis"],
                label: "Use External Emojis",
                description:
                    "Allows the user to use external emojis.",
            },
            UseChatFormatting: {
                permissions: ["UseChatFormatting"],
                label: "Use Chat Formatting",
                description:
                    "Allows the user to use chat formatting.",
            },
            ManageMessages: {
                permissions: ["ManageMessages"],
                label: "Manage Messages",
                description:
                    "Allows the user to manage messages.",
            },
            BypassSlowmode: {
                permissions: ["BypassSlowmode"],
                label: "Bypass Slowmode",
                description:
                    "Allows the user to bypass slowmode.",
            },
            MemberRoles: {
                permissions: ["ManageMemberRoles"],
                label: "Change Member Roles",
                description:
                    "Allows the user to change the roles of a member.",
            },
            MemberMute: {
                permissions: ["TimeoutMembers"],
                label: "Mute Member",
                description:
                    "Allows the user to mute a member.",
            },
            MemberDeafen: {
                permissions: ["MemberDeafen"],
                label: "Deafen Member",
                description:
                    "Allows the user to deafen a member.",
            },
            MemberMove: {
                permissions: ["MemberMove"],
                label: "Move Member",
                description:
                    "Allows the user to move a member.",
            },
            MemberVoice: {
                permissions: ["MemberVoice"],
                label: "Change Member Voice",
                description:
                    "Allows the user to change the voice of a member.",
            },
            EmojiName: {
                permissions: ["ManageEmojiName"],
                label: "Change Emoji Name",
                description:
                    "Allows the user to change the name of an emoji.",
            },
            EmojiImage: {
                permissions: ["ManageEmojiImage"],
                label: "Change Emoji Image",
                description:
                    "Allows the user to change the image of an emoji.",
            },
            UploadEmoji: {
                permissions: ["CreateEmoji"],
                label: "Upload Emoji",
                description:
                    "Allows the user to upload emojis.",
            },
            DeleteEmoji: {
                permissions: ["DeleteEmoji"],
                label: "Delete Emoji",
                description:
                    "Allows the user to delete emojis.",
            },
            BanMembers: {
                permissions: ["BanMembers"],
                label: "Ban Members",
                description:
                    "Allows the user to ban members.",
            },
            UnbanMembers: {
                permissions: ["UnbanMembers"],
                label: "Unban Members",
                description:
                    "Allows the user to unban members.",
            },
            ViewBans: {
                permissions: ["ViewBans"],
                label: "View Bans",
                description:
                    "Allows the user to view bans.",
            },
            KickMembers: {
                permissions: ["KickMembers"],
                label: "Kick Members",
                description:
                    "Allows the user to kick members.",
            },
            TimeoutMembers: {
                permissions: ["TimeoutMembers"],
                label: "Timeout Members",
                description:
                    "Allows the user to timeout members.",
            },
            Nickname: {
                permissions: ["Nickname"],
                label: "Change Nickname",
                description:
                    "Allows the user to change their own nickname.",
            },
            ChangeNickname: {
                permissions: ["ManageNickname"],
                label: "Change Other Member's Nickname",
                description:
                    "Allows the user to change other members' nicknames.",
            },
            CreateInvite: {
                permissions: ["CreateInvite"],
                label: "Create Invite",
                description:
                    "Allows the user to create invites.",
            },
            DeleteInvite: {
                permissions: ["DeleteInvite"],
                label: "Delete Invite",
                description:
                    "Allows the user to delete invites.",
            },
            ViewInvites: {
                permissions: ["ViewInvites"],
                label: "View Invites",
                description:
                    "Allows the user to view invites.",
            },
        },
    },
} satisfies {
    simple: {
        groups: {
            [key: string]: {
                permissions: PermissionKey[];
                label: string;
                description: string;
            };
        };
    },
    advanced: {
        groups: {
            [key: string]: {
                permissions: PermissionKey[];
                label: string;
                description: string;
            };
        };
    };
};

export default permissionsDescriptions;