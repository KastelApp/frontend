/**
 * ? Permissions are now like this
 * ? [[ 256n, 1n ]] // 256n = ManageInvites, 1n = CreateInvite
 * ? The main group is ManageInvites, the sub permission is CreateInvite
 * ? If the second number is -1n, then it means that all the permissions for that group are enabled
 * ? If its 0n, then it means nothing is enabled
 * ? The concept of permissions are still the same as Discords, we just have more control over them.
 * ? PermissionOverrides still will have "allow" and "deny" properties, but they now will be an array of arrays of strings (BigInts)
 */

import { permissions } from "@/data/constants.ts";
import FlagUtils from "@/utils/FlagUtils.ts";

type hasType = "all" | "some";

type PermissionKeys = {
	[K in keyof typeof permissions]: keyof (typeof permissions)[K]["subPermissions"];
};

type PermissionKey = PermissionKeys[keyof PermissionKeys] | "Administrator";

class Permissions {
	public bits: [bigint | string, FlagUtils<(typeof permissions)[keyof typeof permissions]["subPermissions"]>][];

	public constructor(bits: [bigint | string, bigint | string][]) {
		this.bits = bits.map(([group, subPermission]) => [
			BigInt(group),
			new FlagUtils<(typeof permissions)[keyof typeof permissions]["subPermissions"]>(
				subPermission,
				Object.values(permissions).find((permission) => permission.int === BigInt(group))?.subPermissions ?? {},
			),
		]);
	}

	public has<T extends PermissionKey, HT extends hasType>(perms: T[], ignoreAdmin?: boolean, type?: HT): boolean {
		if (!ignoreAdmin && this.bits.some(([bits]) => BigInt(bits) === permissions.Administrator.int)) {
			return true;
		}

		for (const perm of perms) {
			const group = this.getGroupFromSubPermission(perm)!;

			const index = this.bits.findIndex(([bits]) => BigInt(bits) === permissions[group].int);

			if (index === -1) return false;

			if (type === "all") {
				// @ts-expect-error idc
				if (!this.bits[index][1].has(permissions[group].subPermissions[perm])) return false;
			} else {
				// @ts-expect-error idc
				if (this.bits[index][1].has(permissions[group].subPermissions[perm])) return true;
			}
		}

		return type === "all";
	}

	public add<T extends PermissionKey>(perms: (T | "Administrator")[]): this {
		for (const perm of perms) {
			if (perm === "Administrator") {
				this.bits = [
					[
						permissions.Administrator.int,
						new FlagUtils<(typeof permissions)[keyof typeof permissions]["subPermissions"]>(
							0n,
							permissions.Administrator.subPermissions,
						),
					],
				];

				continue;
			}

			const group = this.getGroupFromSubPermission(perm)!;

			if (!this.bits.find(([perm]) => BigInt(perm) === permissions[group].int)) {
				this.bits.push([
					permissions[group].int,
					new FlagUtils<(typeof permissions)[keyof typeof permissions]["subPermissions"]>(
						0n,
						permissions[group].subPermissions,
					),
				]);
			}

			const index = this.bits.findIndex(([bits]) => BigInt(bits) === permissions[group].int);

			// @ts-expect-error idc
			this.bits[index][1].add(permissions[group].subPermissions[perm]);
		}

		return this;
	}

	private getGroupFromSubPermission(subPermission: PermissionKey): keyof typeof permissions | null {
		for (const group of Object.keys(permissions)) {
			if (subPermission in permissions[group as keyof typeof permissions].subPermissions)
				return group as keyof typeof permissions;
		}

		return null;
	}

	public remove<T extends PermissionKey>(perms: (T | "Administrator")[]): this {
		for (const perm of perms) {
			if (perm === "Administrator") {
				this.bits = this.bits.filter((bits) => BigInt(bits[0]) !== permissions.Administrator.int);

				continue;
			}

			const group = this.getGroupFromSubPermission(perm)!;

			const index = this.bits.findIndex(([bits]) => BigInt(bits) === permissions[group].int);

			// @ts-expect-error idc
			this.bits[index][1].remove(permissions[group].subPermissions[perm]);

			if (this.bits[index][1].bits === 0n) {
				this.bits.splice(index, 1);
			}
		}

		return this;
	}
	public toJSON() {
		const obj: Record<string, Record<string, boolean>> = {};

		for (const [group, stuff] of Object.entries(permissions)) {
			for (const [subPermission] of Object.entries(stuff.subPermissions)) {
				if (!obj[group]) obj[group] = {};

				obj[group][subPermission] = this.has([subPermission as PermissionKey], true, "some");
			}
		}

		return obj;
	}

	public get normizedBits(): [string, string][] {
		return this.bits.map(([bits, subPermission]) => [String(bits), String(subPermission.bits)]);
	}
}

export default Permissions;

export { type PermissionKey };
