import FlagUtils from "./FlagUtils.ts";
import { privateFlags, publicFlags } from "@/data/constants.ts";

const publicPrivateFlags: (keyof typeof privateFlags)[] = ["Ghost", "VerifiedBot", "Bot"];

class FlagFields {
	public PrivateFlags: FlagUtils<typeof privateFlags>;

	public PublicFlags: FlagUtils<typeof publicFlags>;

	public constructor(PrivFlags: bigint | number | string, PubFlags: bigint | number | string) {
		this.PrivateFlags = new FlagUtils(PrivFlags, privateFlags);

		this.PublicFlags = new FlagUtils(PubFlags, publicFlags);
	}

	public get PublicPrivateFlags(): bigint {
		return this.PrivateFlags.clean(publicPrivateFlags);
	}

	public has(bit: bigint | number | keyof typeof privateFlags | keyof typeof publicFlags) {
		return (
			this.PrivateFlags.has(bit as keyof typeof privateFlags) || this.PublicFlags.has(bit as keyof typeof publicFlags)
		);
	}

	public toArray(): (keyof typeof privateFlags | keyof typeof publicFlags)[] {
		return [...this.PrivateFlags.toArray(), ...this.PublicFlags.toArray()];
	}

	public toJSON() {
		return {
			PrivateFlags: this.PrivateFlags.bits.toString(),
			PublicFlags: this.PublicFlags.bits.toString(),
		};
	}

	public static fromJSON(data: { PrivateFlags: bigint | number | string; PublicFlags: bigint | number | string }) {
		return new FlagFields(data.PrivateFlags, data.PublicFlags);
	}
}

export default FlagFields;

export { FlagFields };
