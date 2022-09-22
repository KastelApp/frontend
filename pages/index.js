import Head from "next/head";
import NavBar_Home from "../components/navbar/home";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {getCookie} from "cookies-next";

function HomePage({user}) {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/login')
    }, [])

    return (
        <>
            <Head>
                <title>Kastel</title>
            </Head>

            <NavBar_Home user={user}/>
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