import Head from "next/head";
import {useRouter} from "next/router";
import AppNav from "../../../components/navbar/app";
import {useEffect} from "react";
import * as api from "../../../utils/api";
import {getCookie} from 'cookies-next';
import LoadingPage from "../../../components/app/loading-page";

function AtMe_Index({token, user, dataProps}) {
    const router = useRouter();
    const {state: appReady, stateSetter: setAppReady} = dataProps.appReady

    useEffect(() => {
        (async () => {
            try {
                let userInfo = await api.fetchUser(token);
                console.log(userInfo);
                if (userInfo.errors) {
                    setAppReady(false);
                }

                if (userInfo.data) {
                    // something here
                    setAppReady(true);
                }

                let userGuilds = await api.fetchGuilds(token);
                console.log(userGuilds);
                if (userGuilds.errors) {
                    // something here
                }

                if (userGuilds.data) {
                    // something here
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
                    <AppNav user={user}/>
                </>
            ) : (
                <LoadingPage user={user} token={token} appReady={appReady}/>
            )}

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

export default AtMe_Index;