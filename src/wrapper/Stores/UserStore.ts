import { create } from "zustand";
import { useAPIStore } from "../Stores.ts";

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
}

export interface UserStore {
    users: User[];
    addUser(user: User): void;
    removeUser(id: string): void;
    getUser(id: string): Promise<User | undefined>;
    getCurrentUser(): User | undefined;
}

export const useUserStore = create<UserStore>((set, get) => ({
    users: [],
    addUser: (user) => {
        const currentUsers = get().users;

        const foundUser = currentUsers.find((currentUser) => currentUser.id === user.id) ?? {}

        set({
            users: [
                ...currentUsers,
                {
                    ...foundUser,
                    ...user
                }
            ]
        })
    },
    getCurrentUser: () => get().users.find((user) => user.isClient),
    getUser: async (id) => {
        const foundUser = get().users.find((user) => user.id === id);

        if (foundUser) return foundUser;

        const api = useAPIStore.getState().api;

        if (!api) return;

        console.log("FETCH", api)
    },
    removeUser: (id) => set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
}));