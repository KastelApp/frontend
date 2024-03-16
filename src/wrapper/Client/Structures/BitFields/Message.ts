import { messageFlags } from "$/utils/constants.ts";
import { FlagUtils } from "./NewFlags.ts";

// honestly easiest way instead of rewriting old code
class MessageFlags extends FlagUtils<typeof messageFlags> {
	public constructor(bits: bigint | number | string) {
		super(bits, messageFlags);
	}
}

export default MessageFlags;

export { MessageFlags };
