import StringFormatter from "$/utils/StringFormatter.ts";
import { permissionOverrideTypes } from "$/utils/constants.ts";
import BaseChannel from "../Channels/BaseChannel.ts";
import Role from "../Guild/Role.ts";
import Permissions, { PermissionKey } from "./Permissions.ts";

class PermissionHandler {
	public owner: boolean;

	public memberRoles: Role[];

	public channels: {
		id: string;
		overrides: {
			allow: Permissions;
			deny: Permissions;
			// Role / Member Id
			id: string;
			type: "Member" | "Role";
		}[];
	}[];

	public guildMemberId: string;

	public constructor(
		guildMemberId: string,
		owner: boolean,
		memberRoles: Role[],
		channels?: BaseChannel[],
	) {
		this.guildMemberId = guildMemberId;

		this.owner = owner;

		this.memberRoles = memberRoles;

		this.channels = channels?.map((channel) => ({
			id: channel.id,
			overrides: Object.entries(channel.permissionOverrides).map(([id, override]) => ({
				allow: new Permissions(override.allow),
				deny: new Permissions(override.deny),
				id,
				type: override.type === permissionOverrideTypes.Member ? "Member" : "Role",
			})),
		})) ?? [];
	}

	/**
	 *? Checks if you have permission on any role, also takes in account position (i.e if you have a role with the permission, but a role above that role denies it, then you don't have the permission)
	 */
	public hasAnyRole(permission: PermissionKey[], dupe?: boolean): boolean {
		// ? If you are the owner or co-owner, you have all permissions
		if (this.owner) return true;

		const roles = this.memberRoles
			.filter((role) => {
				console.log(this.memberRoles)

				return role.permissions.has(permission);
			})
			.sort((a, b) => b.position - a.position);

		if (dupe) return roles.length > 0;

		return roles.length > 0 && roles[0]!.permissions.has(permission);
	}

	/**
	 *? If you are able to manage a specific role (mainly checks the position of the role) 
	 */
	public canManageRole(role: { id: string; permissions: [bigint | string, bigint | string][]; position: number; }): boolean {
		if (this.owner) return true;

		const membersHighestRole = this.memberRoles.sort((a, b) => b.position - a.position)[0];

		if (!membersHighestRole) return false;

		return membersHighestRole.position > role.position;
	}

	/**
	 *? Checks if you have permissiosn to a specific channel
	 */
	public hasChannelPermission(channelId: string, permission: PermissionKey[]): boolean {		
		const channel = this.channels.find((Channel) => Channel.id === channelId);
		
		if (!channel) {
			StringFormatter.log(
				`${StringFormatter.purple("[Wrapper]")} ${StringFormatter.yellow("[PermissionHandler]")} ${StringFormatter.white(`Channel not found (ID: ${channelId})`)}`,
			);

			return false;
		}
		
		if (this.owner) return true;

		const overrides = channel.overrides.filter((Override) => Override.id === this.guildMemberId || this.memberRoles.some((Role) => Role.id === Override.id));

		if (overrides.length === 0) {

			// StringFormatter.log(
			// 	`${StringFormatter.purple("[Wrapper]")} ${StringFormatter.yellow("[PermissionHandler]")} ${StringFormatter.white("No overrides found for channel, defaulting to role permissions")}`,
			// );

			return this.hasAnyRole(permission);
		}

		const allow = overrides.some((Override) => Override.allow.has(permission));

		const deny = overrides.some((Override) => Override.deny.has(permission));

		return allow && !deny;
	}

}

export default PermissionHandler;
