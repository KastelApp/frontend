import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {deleteCookie, getCookie} from 'cookies-next';
import LoadingPage from "../../components/app/loading-page";

function HomePage({token, user}) {
    const router = useRouter();

    useEffect(() => {
        deleteCookie('token');
        deleteCookie('user');
        router.push('/');
    }, [])

    return (
        <>
            <Head>
                <title>Kastel App</title>
            </Head>

            <LoadingPage user={user} token={token} appReady={false}/>

        </>
    )
}

export const getServerSideProps = ({req, res}) => {
    let token = getCookie('token', {req, res}) || null;
    let user = getCookie('user', {req, res}) || null;

    if (!token || !user) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    return {
        props: {
            token: getCookie('token', {req, res}) || null,
            user: getCookie('user', {req, res}) || null,
        }
    };
};

export default HomePage;