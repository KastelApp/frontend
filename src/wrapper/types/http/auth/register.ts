import { ErrorResponse } from "../error.ts";

export type RegisterResponse = {
    token: string;
    user: {
        id: string;
        email: string;
        username: string;
        tag: string;
        publicFlags: string;
        flags: string
    }
} & ErrorResponse

export interface ApiRegisterOptions {
    email: string;
    password: string;
    username: string;
    inviteCode?: string;
    platformInviteCode?: string;
} 