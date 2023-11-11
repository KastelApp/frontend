import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

export default function Home() {
    const {t, i18n} = useTranslation('app')
    return (
        <>

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