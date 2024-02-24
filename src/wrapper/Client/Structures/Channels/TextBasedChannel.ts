import BaseChannel from "./BaseChannel.ts";

class TextBasedChannel extends BaseChannel {
    public get messages() {
        return [];
    }

    public fetchMessages(options?: {
        limit: number,
        before?: string,
        after?: string,
        around?: string
    }) {
        console.log(options);
    }
}

export default TextBasedChannel;