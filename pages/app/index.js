import Head from "next/head";
import {getCookie} from 'cookies-next';
import LoadingPage from "../../components/app/loading-page";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {UserSocket} from "../../utils/ws/userSocket"

function HomePage({token, dataProps}) {
    const {state: appReady, stateSetter: setAppReady} = dataProps.appReady
    const {state: userData, stateSetter: setUserData} = dataProps.userData
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const WS = new UserSocket(token, '1', 'json')
                const userData = await WS.connect();
                console.log(userData)
                setUserData(userData);
                router.push('/app/@me');
                setAppReady(true);

            } catch (e) {
                console.log("Error: ");
                setAppReady(false);
                console.log(e)
                if (e.message === 'Invalid token') {
                    router.push('/app/logout?redirect=/login')
                } else {
                    router.push('/app/logout');
                }
            }
        })();
    }, [])

    return (
        <>
            <Head>
                <title>Kastel App</title>
            </Head>

            {/* Loading Page */}

            <LoadingPage user={userData} token={token} appReady={appReady}/>

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