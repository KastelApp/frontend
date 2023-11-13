import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
// import {initClient} from "@/utils/client";
import {useRecoilState} from "recoil";
import {tokenStore} from "@/utils/stores";

export default function App() {
    const {t, i18n} = useTranslation('app')
    const router = useRouter();
    const [token, setToken] = useRecoilState(tokenStore);
    const [client, setClient] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
           /* let cli = initClient(token);
            setClient(cli);
            setUser(cli?.users?.getCurrentUser())*/
        } else {
            router.push('/login');
        }
    }, [])

    return (
        <>
            {t('welcome', { name: user?.username })}
        </>
    )
}

export const getStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en', [
            'app',
        ])),
    },
})