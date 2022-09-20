import Head from "next/head";
import {useRouter} from "next/router";

function HomePage() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Kastel App</title>
            </Head>

        </>
    )
}

export default HomePage;