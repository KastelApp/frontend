import { create } from "zustand";
import { useAPIStore } from "../Stores.ts";
import Logger from "@/utils/Logger.ts";

export interface User {
    id: string;
    email: string | null;
    emailVerified: boolean;
    username: string;
    globalNickname: string | null;
    tag: string;
    avatar: string | null;
    publicFlags: string;
    flags: string;
    phoneNumber: string | null;
    mfaEnabled: boolean;
    mfaVerified: boolean;
    bio: string | null;
    isClient: boolean;
    isSystem: boolean;
    isBot: boolean;
    defaultAvatar: string;
}

export interface UserStore {
    users: User[];
    addUser(user: Partial<User>): void;
    removeUser(id: string): void;
    getUser(id: string): User | null;
    getCurrentUser(): User | null;
    getDefaultAvatar(id: string): string;
    fetchUser(id: string): Promise<User | null>;
}

export const useUserStore = create<UserStore>((set, get) => ({
    users: [],
    addUser: (user) => {
        const currentUsers = get().users;

        const foundUser = currentUsers.find((currentUser) => currentUser.id === user.id) ?? {};

        set({
            users: [
                ...currentUsers,
                {
                    ...{
                        avatar: null,
                        bio: null,
                        email: null,
                        emailVerified: false,
                        flags: "0",
                        globalNickname: null,
                        id: "",
                        isClient: false,
                        mfaEnabled: false,
                        mfaVerified: false,
                        phoneNumber: null,
                        publicFlags: "0",
                        tag: "0000",
                        username: "Unknown User",
                        isBot: false,
                        isSystem: false,
                        defaultAvatar: get().getDefaultAvatar(user.id ?? "0")
                    },
                    ...foundUser,
                    ...user
                }
            ]
        });
    },
    getCurrentUser: () => {
        const foundCurrentUser = get().users.find((user) => user.isClient);

        if (!foundCurrentUser) {
            Logger.error("No current user found, dumping users", "UserStore | getCurrentUser()");
            console.log(get().users);

            return null;
        }

        return foundCurrentUser;
    },
    getUser: (id) => {
        const foundUser = get().users.find((user) => user.id === id);

        if (foundUser) return foundUser;

        return null;
    },
    fetchUser: async () => {
       return null;
    },
    removeUser: (id) => set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
    getDefaultAvatar: (id) => `/icon-${BigInt(id) % 5n}.png`
}));