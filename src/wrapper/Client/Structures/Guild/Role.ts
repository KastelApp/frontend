import Websocket from "$/WebSocket/WebSocket.ts";
import { Role as RawRole } from "$/types/payloads/ready.ts";
import createGsetters from "$/utils/createGsetters.ts";
import Permissions from "../BitFields/Permissions.ts";

class Role {
  #ws: Websocket;

  public get ws() {
    return this.#ws;
  }

  public set ws(ws: Websocket) {
    this.#ws = ws;
  }

  @createGsetters("role")
  private _name: string;
  public name!: string;

  @createGsetters("role")
  private _color: number;
  public color!: number;

  @createGsetters("role")
  private _hoist: boolean;
  public hoist!: boolean;

  @createGsetters("role")
  private _id: string;
  public id!: string;

  @createGsetters("role")
  private _permissions: Permissions; // todo: finish permission system
  public permissions!: Permissions; // todo: finish permission system

  @createGsetters("role")
  private _position: number;
  public position!: number;

  @createGsetters("role")
  private _allowedAgeRestricted: boolean;
  public allowedAgeRestricted!: boolean;

  @createGsetters("role")
  private _guildId: string;
  public guildId!: string;

  public constructor(ws: Websocket, data: Partial<RawRole>, guildId: string) {
    // ? roles cannot be partial, if you have a non full role, then its a bug - darkerink (2024-02-09 (YYYY-MM-DD))
    this.#ws = ws;

    this._name = data.name ?? "Unknown Role";

    this._color = data.color ?? 0;

    this._hoist = data.hoist ?? false;

    this._id = data.id ?? "";

    this._permissions = new Permissions(data.permissions ?? []);

    this._position = data.position ?? 0;

    this._allowedAgeRestricted = data.allowedAgeRestricted ?? false;

    this._guildId = guildId;
  }

  public get hexColor() {
    // if the color is 0, then we want to return the default color (which is c4c9ce)
    return this.color === 0 ? "#c4c9ce" : `#${this.color.toString(16)}`;
  }
}

export default Role;
