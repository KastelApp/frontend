import Head from "next/head";
import NavBar_Home from "../components/navbar/home";
import {useEffect} from "react";
import {useRouter} from "next/router";

function HomePage() {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/login')
    }, [])

    return (
        <>
            <Head>
                <title>Kastel</title>
            </Head>

            <NavBar_Home/>
        </>
    )
}

export default HomePage;