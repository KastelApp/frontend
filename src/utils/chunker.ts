import type Message from "$/Client/Structures/Message.ts";

export interface Chunk {
    userId: string;
    time: Date;
    messages: Message[];
}

const messageChunker = (msgs: Message[]): Chunk[] => {
    const chunkedMessages: Chunk[] = [];
    let currentChunk: Chunk | null = null;

    const sortedMessages = msgs.sort((a, b) => {
        return a.creationDate.getTime() - b.creationDate.getTime();
    });

    for (const msg of sortedMessages) {
        if (msg.state === "deleted") continue;

        if (!currentChunk ||
            currentChunk.userId !== msg.authorId ||
            msg.replyingTo !== null ||
            Math.abs(msg.creationDate.getTime()! - currentChunk.time.getTime()) > 15 * 60 * 1000
        ) {
            currentChunk = {
                userId: msg.authorId,
                time: msg.creationDate,
                messages: [msg],
            };

            chunkedMessages.push(currentChunk);
        } else {
            currentChunk.messages.push(msg);
        }
    }

    const newChunkedMessages = chunkedMessages.sort((a, b) => {
        return a.time.getTime() - b.time.getTime();
    });

    for (const chunk of newChunkedMessages) {
        chunk.messages.sort((a, b) => {
            return a.creationDate.getTime() - b.creationDate.getTime();
        });
    }

    return newChunkedMessages.reverse();
};


export default messageChunker;