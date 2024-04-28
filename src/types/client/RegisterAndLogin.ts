import { BaseError } from "../http/error.ts";

export interface RegisterAccountOptions {
  email: string;
  inviteCode?: string;
  platformInviteCode?: string; // ? if the instance of Kastel requires a platform invite code
  password: string;
  resetClient?: boolean; // ? with this as true it will reset the client and automatically add the token etc etc
  username: string;
  turnstile?: string; // ? turnstile is a string that is used to prevent spamming of the register endpoint
}

export interface LoginOptions {
  email: string;
  password: string;
  twoFactor?: string;
  resetClient?: boolean;
  turnstile?: string;
}

export interface RegisterLoginSucces {
  success: true;
  token: string;
  userData: {
    id: string;
    email: string;
    username: string;
    tag: string;
    publicFlags: string;
    flags: string;
  } | null;
}

export interface RegisterLoginFail {
  success: false;
  errors: {
    email: boolean;
    maxUsernames: boolean;
    password: boolean;
    username: boolean;
    unknown: {
      [key: string]: BaseError;
    };
    captchaRequired: boolean;
    internalError: boolean;
  };
}

export type RegisterLoginResponse = RegisterLoginSucces | RegisterLoginFail;
