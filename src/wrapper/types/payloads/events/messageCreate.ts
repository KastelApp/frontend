import { Message } from "$/types/http/channels/messages.ts";

export interface MessageCreatePayload extends Message {
  channelId: string;
}
