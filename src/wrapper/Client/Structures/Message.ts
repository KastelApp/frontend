import Websocket from "$/WebSocket/WebSocket.ts";
import type { Message as MessageType } from "$/types/http/channels/messages";
import { useMessageStore } from "$/utils/Stores.ts";
import createGsetters from "$/utils/createGsetters.ts";

class Message {
  #ws: Websocket;

  public get ws() {
    return this.#ws;
  }

  public set ws(ws: Websocket) {
    this.#ws = ws;
  }

  @createGsetters("message")
  public _id: string;
  public id!: string;

  @createGsetters("message")
  public _state: "sent" | "deleted" | "sending" | "failed";
  public state!: "sent" | "deleted" | "sending" | "failed";

  @createGsetters("message")
  public _authorId: string;
  public authorId!: string;

  @createGsetters("message")
  public _content: string;
  public content!: string;

  @createGsetters("message")
  public _creationDate: Date;
  public creationDate!: Date;

  @createGsetters("message")
  public _editedDate: Date | null;
  public editedDate!: Date | null;

  @createGsetters("message")
  public _embeds: unknown[];
  public embeds!: unknown[];

  @createGsetters("message")
  public _nonce: string | null;
  public nonce!: string | null;

  @createGsetters("message")
  public _replyingTo: string | null;
  public replyingTo!: string | null;

  @createGsetters("message")
  public _attachments: unknown[];
  public attachments!: unknown[];

  @createGsetters("message")
  public _flags: number;
  public flags!: number;

  @createGsetters("message")
  public _allowedMentions: number;
  public allowedMentions!: number;

  @createGsetters("message")
  public _mentions: {
    channels: unknown[];
    roles: unknown[];
    users: unknown[];
  };
  public mentions!: {
    channels: unknown[];
    roles: unknown[];
    users: unknown[];
  };

  @createGsetters("message")
  public _pinned: boolean;
  public pinned!: boolean;

  @createGsetters("message")
  public _deletable: boolean;
  public deletable!: boolean;

  @createGsetters("message")
  public _channelId?: string;
  public channelId?: string;

  public constructor(
    ws: Websocket,
    data: Partial<MessageType>,
    state: "sent" | "deleted" | "sending" | "failed" = "sent",
    channelId?: string,
  ) {
    this.#ws = ws;

    this._id = data.id ?? ws.snowflake.generate();

    this._authorId = data.author?.id ?? "";

    this._content = data.content ?? "";

    this._creationDate = new Date(data.creationDate ?? Date.now());

    this._editedDate = data.editedDate ? new Date(data.editedDate) : null;

    this._embeds = data.embeds ?? [];

    this._nonce = data.nonce ?? null;

    if (data.replyingTo && typeof data.replyingTo === "object") {
      if ("content" in data.replyingTo) {
        useMessageStore
          .getState()
          .addMessage(new Message(ws, data.replyingTo, "sent", channelId));
        this._replyingTo = data.replyingTo.id;
      } else {
        this._replyingTo = data.replyingTo.messageId;
      }
    } else {
      this._replyingTo = null;
    }

    this._attachments = data.attachments ?? [];

    this._flags = data.flags ?? 0;

    this._allowedMentions = data.allowedMentions ?? 0;

    this._mentions = data.mentions ?? {
      channels: [],
      roles: [],
      users: [],
    };

    this._pinned = data.pinned ?? false;

    this._deletable = data.deletable ?? false;

    this._state = state;

    this._channelId = channelId;
  }

  public get edited() {
    return this.editedDate !== null;
  }

  public get time() {
    // if its from today, do "Today at 3:00 PM" or if its from yesterday "Yesterday at 3:00 PM" else just "01/21/2024 3:00 PM"
    const now = new Date();

    if (now.getDate() === this.creationDate.getDate()) {
      return `Today at ${this.creationDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      })}`;
    } else if (now.getDate() - 1 === this.creationDate.getDate()) {
      return `Yesterday at ${this.creationDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      })}`;
    }

    return this.creationDate.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  public fastUpdate(
    data: Partial<MessageType>,
    state: "sent" | "deleted" | "sending" | "failed" = "sent",
  ) {
    this._content = data.content ?? this.content;

    this._editedDate = data.editedDate
      ? new Date(data.editedDate)
      : this.editedDate;

    this._embeds = data.embeds ?? this.embeds;

    this._nonce = data.nonce ?? this.nonce;

    if (data.replyingTo && typeof data.replyingTo === "object") {
      if ("content" in data.replyingTo) {
        useMessageStore
          .getState()
          .addMessage(
            new Message(this.ws, data.replyingTo, "sent", this.channelId),
          );
        this._replyingTo = data.replyingTo.id;
      } else {
        this._replyingTo = data.replyingTo.messageId;
      }
    } else {
      this._replyingTo = this.replyingTo;
    }

    this._attachments = data.attachments ?? this.attachments;

    this._flags = data.flags ?? this.flags;

    this._allowedMentions = data.allowedMentions ?? this.allowedMentions;

    this._mentions = data.mentions ?? this.mentions;

    this._pinned = data.pinned ?? this.pinned;

    this._deletable = data.deletable ?? this.deletable;

    this._state = state;

    this._id = data.id ?? this.id;

    return this;
  }

  public async delete() {}
}

export default Message;
