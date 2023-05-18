import Head from "next/head";
import NavBar_Home from "../components/navbar/home";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {getCookie} from "cookies-next";
import Script from "next/script";
import {Hero} from "../components/home/hero";

function HomePage({user}) {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/login')
    }, [])

    return (
        <>
            {process.env.NODE_ENV === 'production' && (
                <Script async defer data-website-id="83dba013-b17b-45c2-a9bd-9f81d2a63c1c"
                        src="https://analytics.kastelapp.com/umami.js"></Script>
            )}
            <Head>
                <title>Kastel</title>
            </Head>

            <NavBar_Home user={user}/>

            <Hero/>

        </>
    )
}

export const getServerSideProps = ({req, res}) => {
    return {
        props: {
            user: getCookie('user', {req, res}) || null,
        }
    };
};

export default HomePage;