import Head from "next/head";
import {useRouter} from "next/router";
import AppNav from "../../components/navbar/app";
import {useEffect} from "react";
import {deleteCookie, getCookie} from 'cookies-next';

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

            <AppNav user={user}/>

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