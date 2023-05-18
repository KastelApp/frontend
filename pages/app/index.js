import Head from "next/head";
import {getCookie} from 'cookies-next';
import LoadingPage from "../../components/app/loading-page";
import * as api from "../../utils/api";
import {useRouter} from "next/router";
import {useEffect} from "react";

function HomePage({token, dataProps}) {
    const {state: appReady, stateSetter: setAppReady} = dataProps.appReady
    const {state: userData, stateSetter: setUserData} = dataProps.userData
    const router = useRouter();

    useEffect(() => {
        (async () => {
            setTimeout(async () => {

                {/* in the near future (once the websocket is up and running) this will be removed, and we will use a ws response */
                }

                try {
                    let userInfo = await api.fetchUser(token);

                    if (userInfo.Errors) {
                        router.push('/app/logout')
                        setAppReady(false);
                    } else if (userInfo) {
                        setUserData(userInfo);
                        router.push('/app/@me');
                        setAppReady(true);
                    } else {
                        setAppReady(false);
                    }

                } catch (e) {
                    console.log("API Error: " + e);
                    setAppReady(false);
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