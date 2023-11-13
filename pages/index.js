import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "@/components/seo";

export default function Home() {
    const {t, i18n} = useTranslation('common')
    return (
        <>
            <SEO
                title={t('title')}
            />



        </>
    )
}

export const getStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en', [
            'common',
        ])),
    },
})