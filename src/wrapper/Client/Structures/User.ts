import { Presence, UserPayload } from "$/types/payloads/ready.ts";
import Websocket from "$/WebSocket/WebSocket.ts";

class User<IsClient extends boolean = false> {
    public id: string;
    
    public email: IsClient extends true ? string : null;
    
    public emailVerified: IsClient extends true ? boolean : false;
    
    public username: string;
    
    public globalNickname: string | null;
    
    public tag: string;
    
    public avatar: string | null;
    
    public publicFlags: string;
    
    public flags: string;
    
    public phoneNumber: IsClient extends true ? string : null;
    
    public mfaEnabled: IsClient extends true ? boolean : false;
    
    public mfaVerified: IsClient extends true ? boolean : false;
    
    public bio: string | null;

    public presence: Presence[];

    public isClient: IsClient;

    public partial: boolean;

    #ws: Websocket;

    public get ws() {
        return this.#ws;
    }

    public set ws(ws: Websocket) {
        this.#ws = ws;
    }

    public constructor(ws: Websocket, data: Partial<UserPayload>, presence: Presence[], isClient: IsClient, partial = false) {
        this.id = data.id ?? "";
        
        this.email = (isClient ? data.email : null) as IsClient extends true ? string : null;
        
        this.emailVerified = (isClient ? data.emailVerified : false) as IsClient extends true ? boolean : false;
        
        this.username = data.username ?? "Unknown User";
        
        this.globalNickname = data.globalNickname ?? null;
        
        this.tag = data.tag ?? "0000";
        
        this.avatar = data.avatar ?? null;
        
        this.publicFlags = data.publicFlags ?? "0";
        
        this.flags = data.flags ?? "0";
        
        this.phoneNumber = (isClient ? data.phoneNumber : null) as IsClient extends true ? string : null;
        
        this.mfaEnabled = (isClient ? data.mfaEnabled : false) as IsClient extends true ? boolean : false;
        
        this.mfaVerified = (isClient ? data.mfaVerified : false) as IsClient extends true ? boolean : false;
        
        this.bio = data.bio ?? null;

        this.presence = presence;

        this.isClient = isClient;

        this.partial = partial;

        this.#ws = ws;
    }

    public get fullUsername() {
        return `${this.username}#${this.tag.padStart(4, "0")}`;
    }

    public getAvatarUrl(options: { size: number }) {
        console.log(options);

        return "/icon-1.png"
    }

    public get currentPresence() {
        return this.presence.some((p) => p.status === "invisible") ? "invisible" : this.presence.find((p) => p.current)?.status ?? "offline";
    }

    public uploadAvatar(file: File) {
        console.log(file);
        return {
            hash: "",
            success: false
        }
    }

    public updateUser(options: {
        username?: string;
        email?: string;
        newPassword?: string;
        password?: string;
        tag?: string;
        avatar?: string | null;
      }) {
        console.log(options);
    }
}

export default User;