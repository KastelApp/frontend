import { useAPIStore, useClientStore, useIsReady, useTokenStore } from "@/wrapper/Stores.ts";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "./Loading.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";

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

        if (isReady) return; // ? This is to prevent an infinite loop

        client.connect(token);

        client.on("ready", () => {
            setIsReady(true);
        });

        client.on("close", () => {
            setIsReady(false);
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