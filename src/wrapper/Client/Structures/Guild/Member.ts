import Websocket from "$/WebSocket/WebSocket.ts";
import { Member as RawMember } from "$/types/payloads/ready.ts";
import { useUserStore } from "$/utils/Stores.ts";
import createGsetters from "$/utils/createGsetters.ts";

class Member {
  #ws: Websocket;

  public get ws() {
    return this.#ws;
  }

  public set ws(ws: Websocket) {
    this.#ws = ws;
  }

  @createGsetters("member")
  private _guildId: string;
  public guildId!: string;

  @createGsetters("member")
  private _owner: boolean;
  public owner!: boolean;

  @createGsetters("member")
  private _coOwner: boolean;
  public coOwner!: boolean;

  @createGsetters("member")
  private _roleIds: string[];
  public roleIds!: string[];

  @createGsetters("member")
  private _nickname: string | null;
  public nickname!: string | null;

  @createGsetters("member")
  private _userId: string;
  public userId!: string;

  @createGsetters("member")
  private _partial: boolean;
  public partial!: boolean;

  @createGsetters("member")
  private _joinedAt: Date;
  public joinedAt!: Date;

  public constructor(
    ws: Websocket,
    data: Partial<RawMember>,
    guildId: string,
    partial = false,
  ) {
    this.#ws = ws;

    this._guildId = guildId;

    this._owner = data.owner ?? false;

    this._roleIds = data.roles ?? [];

    this._nickname = data.nickname ?? null;

    this._userId = data.user?.id ?? "";

    this._coOwner = false;

    this._partial = partial;

    this._joinedAt = new Date(data.joinedAt ?? Date.now());
  }

  public get displayUsername() {
    return (
      this.nickname ??
      useUserStore.getState().users.find((user) => user.id === this.userId)
        ?.displayUsername ??
      "Unknown User"
    );
  }
}

export default Member;
