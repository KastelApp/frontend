import Head from "next/head";
import NavBar_Home from "../components/navbar/home";

function HomePage() {
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