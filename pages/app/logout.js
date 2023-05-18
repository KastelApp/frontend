import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {deleteCookie, getCookie} from 'cookies-next';
import LoadingPage from "../../components/app/loading-page";

function HomePage({token, dataProps}) {
    const router = useRouter();
    const {state: userData, stateSetter: setUserData} = dataProps.userData

    useEffect(() => {
        deleteCookie('token');
        router.push('/');
    }, [])

    return (
        <>
            <Head>
                <title>Kastel App</title>
            </Head>

            <LoadingPage user={userData} token={token} appReady={false}/>

        </>
    )
}

export const getServerSideProps = ({req, res}) => {
    let token = getCookie('token', {req, res}) || null;

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    return {
        props: {
            token: getCookie('token', {req, res}) || null
        }
    };
};

export default HomePage;