import Head from "next/head";
import {useRouter} from "next/router";
import AppNav from "../../components/navbar/app";
import {useEffect} from "react";
import * as api from "../../utils/api";

function HomePage() {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            let test = await api.fetchUser();
            console.log(test);
        })();
    },[] )

    return (
        <>
            <Head>
                <title>Kastel App</title>
            </Head>

            <AppNav/>

        </>
    )
}

export default HomePage;