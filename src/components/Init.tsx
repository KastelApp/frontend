import { useAPIStore, useClientStore, useCurrentStore, useIsReady, useTokenStore } from "@/wrapper/Stores.ts";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "./Loading.tsx";

const Init = ({
    children
}: {
    children?: React.ReactElement | React.ReactElement[];
}) => {
    const { token } = useTokenStore();
    const { client } = useClientStore();
    const { api } = useAPIStore();
    const router = useRouter();
    const { setIsReady, isReady } = useIsReady();
    const { setCurrentGuildId, setCurrentChannelId } = useCurrentStore()

    useEffect(() => {
        const { guildId, channelId } = router.query as { guildId: string, channelId: string };

        setCurrentGuildId(guildId);
        setCurrentChannelId(channelId);
    }, [router])

    useEffect(() => {
        api.token = token;
    }, [token]);

    const whitelistedPaths: (string | RegExp)[] = [
        /^\/app(\/.*)?/,
    ];

    useEffect(() => {
        if (!whitelistedPaths.some((path) => router.pathname.match(path) || path === router.pathname)) {
            setIsReady(true);

            return;
        }

        if (!token) {
            router.push("/login");

            return;
        }

        if (isReady) return; // ? This is to prevent an infinite loop

        client.login(token);

        client.on("ready", () => {
            setIsReady(true);
        })

        client.on("close", () => {
            setIsReady(false);
        })
    }, [router.pathname]);

    return (
        <>
            {!isReady ? <Loading /> : children}
        </>
    );
};

export default Init;