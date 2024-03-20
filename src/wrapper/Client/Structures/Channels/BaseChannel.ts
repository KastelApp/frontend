import type DMBasedChannel from "./DMBasedChannel.ts";
import type TextBasedChannel from "./TextBasedChannel.ts";
import type VoiceBasedChannel from "./VoiceBasedChannel.ts";
import type CategoryChannel from "./CategoryChannel.ts";
import type MarkdownBasedChannel from "./MarkdownBasedChannel.ts";
import { Channel, PermissionOverrides } from "$/types/payloads/ready.ts";
import Websocket from "$/WebSocket/WebSocket.ts";
import constants from "$/utils/constants.ts";
import createGsetters from "$/utils/createGsetters.ts";

class BaseChannel {
  #ws: Websocket;

  public get ws() {
    return this.#ws;
  }

  public set ws(ws: Websocket) {
    this.#ws = ws;
  }

  @createGsetters("channel")
  private _name: string;
  public name!: string;

  @createGsetters("channel")
  private _description: string | null;
  public description!: string | null;

  @createGsetters("channel")
  private _id: string;
  public id!: string;

  @createGsetters("channel")
  private _parentId: string | null;
  public parentId!: string | null;

  @createGsetters("channel")
  private _ageRestricted: boolean;
  public ageRestricted!: boolean;

  @createGsetters("channel")
  private _slowmode: number;
  public slowmode!: number;

  @createGsetters("channel")
  private _type: number;
  public type!: number;

  @createGsetters("channel")
  private _childrenIds: string[];
  public childrenIds!: string[];

  @createGsetters("channel")
  private _permissionOverrides: PermissionOverrides;
  public permissionOverrides!: PermissionOverrides;

  @createGsetters("channel")
  private _position: number;
  public position!: number;

  @createGsetters("channel")
  private _partial: boolean;
  public partial!: boolean;

  @createGsetters("channel")
  private _guildId: string;
  public guildId!: string;

  @createGsetters("channel")
  private _lastMessageId: string | null;
  public lastMessageId!: string | null;

  public constructor(
    ws: Websocket,
    data: Partial<Channel>,
    guildId?: string,
    partial = false,
  ) {
    this.#ws = ws;

    this._name = data.name ?? "Unknown Channel";

    this._description = data.description ?? null;

    this._id = data.id ?? "";

    this._parentId = data.parentId ?? null;

    this._ageRestricted = data.ageRestricted ?? false;

    this._slowmode = data.slowmode ?? 0;

    this._type = data.type ?? 0;

    this._childrenIds = data.children ?? [];

    this._permissionOverrides = data.permissionOverrides ?? {};

    this._position = data.position ?? 0;

    this._guildId = guildId ?? "";

    this._partial = partial;

    this._lastMessageId = data.lastMessageId ?? null;
  }

  public isDmBased(): this is DMBasedChannel {
    return (
      this.type === constants.channelTypes.Dm ||
      this.type === constants.channelTypes.GroupChat
    );
  }

  public isTextBased(): this is DMBasedChannel | TextBasedChannel {
    return (
      this.type === constants.channelTypes.Dm ||
      this.type === constants.channelTypes.GroupChat ||
      this.type === constants.channelTypes.GuildNewMember ||
      this.type === constants.channelTypes.GuildText ||
      this.type === constants.channelTypes.GuildNews ||
      this.type === constants.channelTypes.GuildRules
    );
  }

  public isVoiceBased(): this is VoiceBasedChannel {
    return this.type === constants.channelTypes.GuildVoice;
  }

  public isCategory(): this is CategoryChannel {
    return this.type === constants.channelTypes.GuildCategory;
  }

  public isMarkdownBased(): this is MarkdownBasedChannel {
    return this.type === constants.channelTypes.GuildMarkdown;
  }
}

export default BaseChannel;
