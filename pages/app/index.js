import Head from "next/head";
import {getCookie} from 'cookies-next';
import LoadingPage from "../../components/app/loading-page";
import * as api from "../../utils/api";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";

function HomePage({token, user, dataProps}) {
    const {state: appReady, stateSetter: setAppReady} = dataProps.appReady
    const router = useRouter();
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            setTimeout(async () => {

                {/* in the near futures (once the websocket is up and running) this will be removed, and we will use a ws response */
                }

                try {
                    let userInfo = await api.fetchUser(token);
                    console.log(userInfo);
                    if (userInfo.errors) {
                        setAppReady(false);
                        if (userInfo.errors.some(item => item.code === 'LOGIN_REQUIRED')) {
                            router.push('/app/logout')
                        }
                        if (userInfo.errors.some(item => item.code === 'ERROR')) {
                            router.push('/app/logout')
                        }
                    } else {
                        setError(true)
                    }

                    if (userInfo.data) {
                        router.push('/app/@me');
                        setAppReady(true);
                    }

                } catch (e) {
                    console.log("API Error: " + e);
                    setAppReady(false);
                    setError(true)
                }
            }, 2000);
        })();
    }, [])

    return (
        <>
            <Head>
                <title>Kastel App</title>
            </Head>

            {/* Loading Page */}

            <LoadingPage user={user} token={token} appReady={appReady}/>

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