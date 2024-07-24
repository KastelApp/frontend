import { useAPIStore, useClientStore, useIsReady, useTokenStore } from "@/wrapper/Stores.ts";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "./Loading.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";
import { useRelationshipsStore, Relationship as RelationshipState } from "@/wrapper/Stores/RelationshipsStore.ts";
import Logger from "@/utils/Logger.ts";
import { Relationship } from "@/types/http/user/relationships.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { usePerChannelStore } from "@/wrapper/Stores/ChannelStore.ts";

const Init = ({
    children,
    shouldHaveLayout = false,
}: {
    children?: React.ReactElement | React.ReactElement[];
    shouldHaveLayout?: boolean;
}) => {
    const { token } = useTokenStore();
    const { client } = useClientStore();
    const { api } = useAPIStore();
    const router = useRouter();
    const { setIsReady, isReady } = useIsReady();
    const { addRelationship } = useRelationshipsStore();
    const { channels } = usePerChannelStore();

    useEffect(() => {
        api.token = token;

        setIsReady(false);
    }, [token]);

    const whitelistedPaths: (string | RegExp)[] = [
        /^\/app(\/.*)?/,
    ];

    const blacklistedTokenPaths: (string | RegExp)[] = [
        "/login",
        "/register",
    ];

    useEffect(() => {
        const int = setInterval(() => {
            // ? we go thru all channels if they have a typing user, we check if the time is greater than 7 seconds, if so we remove them
            for (const [channelId, channel] of Object.entries(channels)) {
                if (!channel.typingUsers || channel.typingUsers.length === 0 || !channel.typingUsers.some((user) => Date.now() - user.started > 7000)) continue;

                channel.typingUsers = channel.typingUsers.filter((user) => Date.now() - user.started < 7000);

                usePerChannelStore.getState().updateChannel(channelId, {
                    typingUsers: channel.typingUsers
                });

                console.log("Removing", channel.typingUsers);
            }
        }, 1000);

        return () => clearInterval(int);
    }, [channels])

    useEffect(() => {
        if (blacklistedTokenPaths.some((path) => router.pathname.match(path) || path === router.pathname) && token) {
            router.push("/app");

            setIsReady(false);

            return;
        }

        if (!whitelistedPaths.some((path) => router.pathname.match(path) || path === router.pathname)) {
            setIsReady(true);

            return;
        }

        if (!token) {
            router.push("/login");

            return;
        }

        if (client.isConnected) return; // ? This is to prevent an infinite loop

        setIsReady(false);

        client.connect(token);

        client.on("ready", async () => {
            // @ts-expect-error -- For now exposing the api to global so I can mess with stuff
            globalThis.api = api;

            const relationships = await api.get<unknown, Relationship[]>({
                url: "/users/@me/relationships?includeUser=true"
            });

            // ? If it fails we just set is ready to true and log out the failure
            if (!relationships || relationships.status !== 200) {
                Logger.error("Failed to fetch relationships", "Init | ready event");

                setIsReady(true);

                return;
            }

            if (!Array.isArray(relationships.body)) {
                setIsReady(true);

                return;
            }

            for (const relationship of (relationships.body || [])) {
                if (relationship.user) {
                    useUserStore.getState().addUser(relationship.user);

                    relationship.userId = relationship.user.id;

                    delete relationship.user;
                }

                addRelationship(relationship as RelationshipState);
            }

            setIsReady(true);
        });

        client.on("close", () => {
            setIsReady(false);

            client.isConnected = false;
        });
    }, [router.pathname]);

    return (
        <>
            {!isReady ? <Loading /> :
                <>
                    {shouldHaveLayout ? <AppLayout>{children}</AppLayout> : children}
                </>
            }
        </>
    );
};

export default Init;