import Head from "next/head";
import {useRouter} from "next/router";
import AppNav from "../../../components/navbar/app";
import {useEffect} from "react";
import * as api from "../../../utils/api";
import {getCookie} from 'cookies-next';
import LoadingPage from "../../../components/app/loading-page";

function AtMe_Index({token, dataProps}) {
    const router = useRouter();
    const {state: appReady, stateSetter: setAppReady} = dataProps.appReady
    const {state: guilds, stateSetter: setGuilds} = dataProps.userGuilds
    const {state: userData, stateSetter: setUserData} = dataProps.userData

    useEffect(() => {
        (async () => {
            try {
                let userInfo = await api.fetchUser(token);

                if (userInfo.Errors) {
                    router.push('/app/logout')
                    setAppReady(false);
                } else if (userInfo) {
                    setUserData(userInfo);
                    setAppReady(true);
                } else {
                    setAppReady(false)
                }

                let userGuilds = await api.fetchGuilds(token);
                if (userGuilds.Errors) {
                    // someting here
                }

                if (userGuilds) {
                    // something here
                    setAppReady(true);
                    setGuilds(userGuilds);
                }
            } catch (e) {
                console.log("API Error: " + e);
                setAppReady(false);
            }
        })();
    }, [])

    return (
        <>
            <Head>
                <title>Kastel App</title>
            </Head>

            {appReady ? (
                <>
                    <AppNav guilds={guilds} userInfo={userData}>

                        {/* page content goes inside here */}

                    </AppNav>
                </>
            ) : (
                <LoadingPage user={userData} token={token} appReady={appReady}/>
            )}

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

export default AtMe_Index;