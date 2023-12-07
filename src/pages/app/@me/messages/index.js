import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import {
    clientStore,
    guildStore,
    readyStore,
    tokenStore,
} from "@/utils/stores";
import Loading from "@/components/app/loading";
import SEO from "@/components/seo";
import AppNavbar from "@/components/app/navbar";
import { Box } from "@chakra-ui/react";

export default function AtMeMessages() {
    const { t } = useTranslation("app");
    const router = useRouter();
    const [token] = useRecoilState(tokenStore);
    const [client] = useRecoilState(clientStore);
    const [ready] = useRecoilState(readyStore);
    const [user, setUser] = useState(null);
    const [guilds] = useRecoilState(guildStore);

    useEffect(() => {
        if (!token) return router.push("/login");
        setUser(client?.users?.getCurrentUser());
    }, [ready]);

    return (
        <>
            <SEO title={t("title")} />
            {ready ? (
                <>
                    <Box>
                        <AppNavbar userInfo={user} guilds={guilds} />
                    </Box>
                </>
            ) : (
                <Loading translations={t} />
            )}
        </>
    );
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? "en", ["app"])),
    },
});
