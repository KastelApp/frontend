export interface RegisterAccountOptions {
	email: string;
	inviteCode?: string;
    platformInviteCode?: string; // ? if the instance of Kastel requires a platform invite code
	password: string;
	resetClient?: boolean; // ? with this as true it will reset the client and automatically add the token etc etc
	username: string;
}

export interface LoginOptions {
	email: string;
	password: string;
	resetClient?: boolean;
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
    }
}

export interface RegisterLoginFail {
    success: false;
    errors: {
        email: boolean;
        maxUsernames: boolean;
        password: boolean;
        username: boolean;
        unknown: {
            [k: string]: {
                code: string;
                message: string;
            }
        }
    }
}

export type RegisterLoginResponse = RegisterLoginSucces | RegisterLoginFail;