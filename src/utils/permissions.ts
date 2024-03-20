const permissionsDescriptions = {
    simple: {
        groups: {
            ManageGuild: {
                permissions: ["ChangeServerName", "ChangeServerDescription", "ChangeServerIcon", "ToggleMaintenance", "AddBots", "ViewAuditLog", "ManageVanity"],
                label: "Manage Server",
                description:
                    "Allows the user to manage and change server settings.",
            },
            ManageRoles: {
                permissions: ["RoleName", "RoleColor", "RolePosition", "RolePermissions", "CreateRole", "DeleteRole"],
                label: "Manage Roles",
                description:
                    "Allows the user to create, delete, and edit roles.",
            },
            ManageChannels: {
                permissions: ["ChannelName", "ChannelPosition", "ChannelTopic", "ChannelSlowmode", "ChannelAgeRestriction", "ChannelInvites", "ChannelWebhooks", "CreateChannel", "DeleteChannel", "ManageChannelPermissionOverrides", "ViewChannels", "ViewMessageHistory", "SendMessages", "EmbedLinks", "AttachFiles", "AddReactions", "UseExternalEmojis", "UseChatFormatting", "ManageMessages", "BypassSlowmode"],
                label: "Manage Channels",
                description:
                    "Allows the user to create, delete, and edit channels.",
            },
            ManageMembers: {
                permissions: ["MemberRoles", "MemberMute", "MemberDeafen", "MemberMove", "MemberVoice"],
                label: "Manage Members",
                description:
                    "Allows the user to manage another member's roles, and take actions like deafen, mute, and move members.",
            },
            ManageEmojis: {
                permissions: ["EmojiName", "EmojiImage", "UploadEmoji", "DeleteEmoji"],
                label: "Manage Emojis",
                description: 
                    "Allows the user to manage emojis.",
            },
            Moderation: {
                permissions: ["BanMembers", "UnbanMembers", "ViewBans", "KickMembers", "TimeoutMembers"],
                label: "Moderation",
                description:
                    "Allows the user to ban, unban, view bans, kick, and timeout members.",
            },
            ManageNicknames: {
                permissions: ["Nickname", "ChangeNickname"],
                label: "Manage Nicknames",
                description:
                    "Allows the user to change their own or other members' nicknames.",
            },
            ManageInvites: {
                permissions: ["CreateInvite", "DeleteInvite", "ViewInvites"],
                label: "Manage Invites",
                description:
                    "Allows the user to create, delete, and view invites.",
            }
        },
    },
    advanced: {
        groups: {
            "ManageServerName": {
                permissions: ["ChangeServerName"],
                label: "Change Server Name",
                description:
                    "Allows the user to change the server name.",
            },
            "ManageServerDescription": {
                permissions: ["ChangeServerDescription"],
                label: "Change Server Description",
                description:
                    "Allows the user to change the server description.",
            },
            "ManageServerIcon": {
                permissions: ["ChangeServerIcon"],
                label: "Change Server Icon",
                description:
                    "Allows the user to change the server icon.",
            },
            "ToggleMaintenance": {
                permissions: ["ToggleMaintenance"],
                label: "Toggle Maintenance",
                description:
                    "Allows the user to toggle maintenance mode.",
            },
            "AddBots": {
                permissions: ["AddBots"],
                label: "Add Bots",
                description:
                    "Allows the user to add bots to the server.",
            },
            "ViewAuditLog": {
                permissions: ["ViewAuditLog"],
                label: "View Audit Log",
                description:
                    "Allows the user to view the audit log.",
            },
            "ManageVanity": {
                permissions: ["ManageVanity"],
                label: "Manage Vanity",
                description:
                    "Allows the user to manage the server's vanity URL.",
            },
            "RoleName": {
                permissions: ["RoleName"],
                label: "Change Role Name",
                description:
                    "Allows the user to change the name of a role.",
            },
            "RoleColor": {
                permissions: ["RoleColor"],
                label: "Change Role Color",
                description:
                    "Allows the user to change the color of a role.",
            },
            "RolePosition": {
                permissions: ["RolePosition"],
                label: "Change Role Position",
                description:
                    "Allows the user to change the position of a role.",
            },
            "RolePermissions": {
                permissions: ["RolePermissions"],
                label: "Change Role Permissions",
                description:
                    "Allows the user to change the permissions of a role.",
            },
            "CreateRole": {
                permissions: ["CreateRole"],
                label: "Create Role",
                description:
                    "Allows the user to create roles.",
            },
            "DeleteRole": {
                permissions: ["DeleteRole"],
                label: "Delete Role",
                description:
                    "Allows the user to delete roles.",
            },
            "ChannelName": {
                permissions: ["ChannelName"],
                label: "Change Channel Name",
                description:
                    "Allows the user to change the name of a channel.",
            },
            "ChannelPosition": {
                permissions: ["ChannelPosition"],
                label: "Change Channel Position",
                description:
                    "Allows the user to change the position of a channel.",
            },
            "ChannelTopic": {
                permissions: ["ChannelTopic"],
                label: "Change Channel Topic",
                description:
                    "Allows the user to change the topic of a channel.",
            },
            "ChannelSlowmode": {
                permissions: ["ChannelSlowmode"],
                label: "Change Channel Slowmode",
                description:
                    "Allows the user to change the slowmode of a channel.",
            },
            "ChannelAgeRestriction": {
                permissions: ["ChannelAgeRestriction"],
                label: "Change Channel Age Restriction",
                description:
                    "Allows the user to change the age restriction of a channel.",
            },
            "ChannelInvites": {
                permissions: ["ChannelInvites"],
                label: "Change Channel Invites",
                description:
                    "Allows the user to change the invites of a channel.",
            },
            "ChannelWebhooks": {
                permissions: ["ChannelWebhooks"],
                label: "Change Channel Webhooks",
                description:
                    "Allows the user to change the webhooks of a channel.",
            },
            "CreateChannel": {
                permissions: ["CreateChannel"],
                label: "Create Channel",
                description:
                    "Allows the user to create channels.",
            },
            "DeleteChannel": {
                permissions: ["DeleteChannel"],
                label: "Delete Channel",
                description:
                    "Allows the user to delete channels.",
            },
            "ManageChannelPermissionOverrides": {
                permissions: ["ManageChannelPermissionOverrides"],
                label: "Manage Channel Permission Overrides",
                description:
                    "Allows the user to manage channel permission overrides.",
            },
            "ViewChannels": {
                permissions: ["ViewChannels"],
                label: "View Channels",
                description:
                    "Allows the user to view channels.",
            },
            "ViewMessageHistory": {
                permissions: ["ViewMessageHistory"],
                label: "View Message History",
                description:
                    "Allows the user to view message history.",
            },
            "SendMessages": {
                permissions: ["SendMessages"],
                label: "Send Messages",
                description:
                    "Allows the user to send messages.",
            },
            "EmbedLinks": {
                permissions: ["EmbedLinks"],
                label: "Embed Links",
                description:
                    "Allows the user to embed links.",
            },
            "AttachFiles": {
                permissions: ["AttachFiles"],
                label: "Attach Files",
                description:
                    "Allows the user to attach files.",
            },
            "AddReactions": {
                permissions: ["AddReactions"],
                label: "Add Reactions",
                description:
                    "Allows the user to add reactions.",
            },
            "UseExternalEmojis": {
                permissions: ["UseExternalEmojis"],
                label: "Use External Emojis",
                description:
                    "Allows the user to use external emojis.",
            },
            "UseChatFormatting": {
                permissions: ["UseChatFormatting"],
                label: "Use Chat Formatting",
                description:
                    "Allows the user to use chat formatting.",
            },
            "ManageMessages": {
                permissions: ["ManageMessages"],
                label: "Manage Messages",
                description:
                    "Allows the user to manage messages.",
            },
            "BypassSlowmode": {
                permissions: ["BypassSlowmode"],
                label: "Bypass Slowmode",
                description:
                    "Allows the user to bypass slowmode.",
            },
            "MemberRoles": {
                permissions: ["MemberRoles"],
                label: "Change Member Roles",
                description:
                    "Allows the user to change the roles of a member.",
            },
            "MemberMute": {
                permissions: ["MemberMute"],
                label: "Mute Member",
                description:
                    "Allows the user to mute a member.",
            },
            "MemberDeafen": {
                permissions: ["MemberDeafen"],
                label: "Deafen Member",
                description:
                    "Allows the user to deafen a member.",
            },
            "MemberMove": {
                permissions: ["MemberMove"],
                label: "Move Member",
                description:
                    "Allows the user to move a member.",
            },
            "MemberVoice": {
                permissions: ["MemberVoice"],
                label: "Change Member Voice",
                description:
                    "Allows the user to change the voice of a member.",
            },
            "EmojiName": {
                permissions: ["EmojiName"],
                label: "Change Emoji Name",
                description:
                    "Allows the user to change the name of an emoji.",
            },
            "EmojiImage": {
                permissions: ["EmojiImage"],
                label: "Change Emoji Image",
                description:
                    "Allows the user to change the image of an emoji.",
            },
            "UploadEmoji": {
                permissions: ["UploadEmoji"],
                label: "Upload Emoji",
                description:
                    "Allows the user to upload emojis.",
            },
            "DeleteEmoji": {
                permissions: ["DeleteEmoji"],
                label: "Delete Emoji",
                description:
                    "Allows the user to delete emojis.",
            },
            "BanMembers": {
                permissions: ["BanMembers"],
                label: "Ban Members",
                description:
                    "Allows the user to ban members.",
            },
            "UnbanMembers": {
                permissions: ["UnbanMembers"],
                label: "Unban Members",
                description:
                    "Allows the user to unban members.",
            },
            "ViewBans": {
                permissions: ["ViewBans"],
                label: "View Bans",
                description:
                    "Allows the user to view bans.",
            },
            "KickMembers": {
                permissions: ["KickMembers"],
                label: "Kick Members",
                description:
                    "Allows the user to kick members.",
            },
            "TimeoutMembers": {
                permissions: ["TimeoutMembers"],
                label: "Timeout Members",
                description:
                    "Allows the user to timeout members.",
            },
            "Nickname": {
                permissions: ["Nickname"],
                label: "Change Nickname",
                description:
                    "Allows the user to change their own nickname.",
            },
            "ChangeNickname": {
                permissions: ["ChangeNickname"],
                label: "Change Other Member's Nickname",
                description:
                    "Allows the user to change other members' nicknames.",
            },
            "CreateInvite": {
                permissions: ["CreateInvite"],
                label: "Create Invite",
                description:
                    "Allows the user to create invites.",
            },
            "DeleteInvite": {
                permissions: ["DeleteInvite"],
                label: "Delete Invite",
                description:
                    "Allows the user to delete invites.",
            },
            "ViewInvites": {
                permissions: ["ViewInvites"],
                label: "View Invites",
                description:
                    "Allows the user to view invites.",
            },
        },
    },
};

export default permissionsDescriptions;