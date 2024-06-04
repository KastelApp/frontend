import { useAPIStore, useIsReady, useTokenStore } from "@/wrapper/Stores.ts";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "./Loading.tsx";

const Init = ({
    children
}: {
    children?: React.ReactElement | React.ReactElement[];
}) => {
    const { token } = useTokenStore();
    const { api } = useAPIStore();
    const router = useRouter();
    const { setIsReady, isReady } = useIsReady();

    useEffect(() => {
        api.token = token;
    }, [token]);

    const whitelistedPaths: (string | RegExp)[] = [
        /^\/app?\/.*/,
    ];

    useEffect(() => {
        if (!whitelistedPaths.some((path) => router.pathname.match(path) || path === router.pathname)) {
            setIsReady(true);

            return;
        }
    }, [router.pathname]);

    return (
        <>
            {!isReady ? <Loading /> : children}
        </>
    );
};

export default Init;