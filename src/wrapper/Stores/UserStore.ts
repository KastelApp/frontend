import { create } from "zustand";
import { useAPIStore } from "../Stores.ts";
import Logger from "@/utils/Logger.ts";
import FlagFields from "@/utils/FlagFields.ts";
import safePromise from "@/utils/safePromise.ts";
import { BaseError, isErrorResponse } from "@/types/http/error.ts";

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

export interface UpdateUser {
    username?: string;
    avatar?: string | null;
    bio?: string | null;
    globalNickname?: string | null;
    phoneNumber?: string | null;
    email?: string;
    tag?: string;
    password?: string;
    newPassword?: string;
}

export interface UserStore {
    users: User[];
    addUser(user: Partial<User>): void;
    removeUser(id: string): void;
    getUser(id: string): User | null;
    getCurrentUser(): User | null;
    getDefaultAvatar(id: string): string;
    fetchUser(id: string): Promise<User | null>;
    isStaff(id: string): boolean;
    patchUser(user: UpdateUser): Promise<{
        success: boolean;
        errors: {
            username: boolean;
            avatar: boolean;
            bio: boolean;
            globalNickname: boolean;
            phoneNumber: boolean;
            email: boolean;
            tag: boolean;
            password: boolean;
            newPassword: boolean;
            unknown: {
                [key: string]: BaseError
            }
        }
    }>;
}

export const useUserStore = create<UserStore>((set, get) => ({
    users: [],
    addUser: (user) => {
        const currentUsers = get().users;

        const foundUser = currentUsers.find((currentUser) => currentUser.id === user.id) ?? {};

        set({
            users: [
                ...currentUsers.filter((currentUser) => currentUser.id !== user.id),
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
    getDefaultAvatar: (id) => `/icon-${BigInt(id) % 5n}.png`,
    isStaff: (id) => {
        const user = get().getUser(id);

        if (!user) return false;

        const flags = new FlagFields(user.flags, user.publicFlags);

        return flags.has("StaffBadge") || flags.has("Staff");
    },
    patchUser: async (user) => {
        const api = useAPIStore.getState().api;

        if (!api) {
            throw new Error("Failed to get API");
        }

        const [request, error] = await safePromise(api.patch({
            url: "/users/@me",
            data: user
        }));

        if (error || !request) {
            return {
                success: false,
                errors: {
                    avatar: false,
                    bio: false,
                    email: false,
                    globalNickname: false,
                    newPassword: false,
                    password: false,
                    phoneNumber: false,
                    tag: false,
                    username: false,
                    unknown: {}
                }
            };
        }

        if (
            isErrorResponse<{
               user: {
                code: "PasswordRequired" | "InvalidPassword" | "NothingToUpdate"
                message: string
               }
               username: {
                code: "MaxUsernames"
                message: string
               }
               tag: {
                code: "TagInUse"
                message: string
               }
               email: {
                code: "InvalidEmail"
                message: string
               }
               bio: {
                code: "InvalidType", // ? invalid type = too long of bio or wrong type (i.e boolean instead of string)
                message: string
               }
            }>(request.body)
        ) {
            return {
                success: false,
                errors: {
                    avatar: false,
                    bio: request.body.errors.bio?.code === "InvalidType",
                    email: request.body.errors.email?.code === "InvalidEmail",
                    globalNickname: false,
                    newPassword: false,
                    password: request.body.errors.user?.code === "InvalidPassword",
                    phoneNumber: false,
                    tag: request.body.errors.tag?.code === "TagInUse",
                    username: request.body.errors.username?.code === "MaxUsernames",
                    unknown: Object.fromEntries(
                        Object.entries(request.body.errors).filter(([, error]) => error.code !== "InvalidEmail" && error.code !== "InvalidPassword" && error.code !== "MaxUsernames" && error.code !== "TagInUse" && error.code !== "InvalidType")
                    )
                }
            };
        }

        return {
            success: true,
            errors: {
                avatar: false,
                bio: false,
                email: false,
                globalNickname: false,
                newPassword: false,
                password: false,
                phoneNumber: false,
                tag: false,
                username: false,
                unknown: {}
            }
        }
    }
}));