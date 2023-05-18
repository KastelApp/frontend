import Head from "next/head";
import {getCookie} from 'cookies-next';
import LoadingPage from "../../../../components/app/loading-page";
import * as api from "../../../../utils/api";
import {useRouter} from "next/router";
import {useEffect} from "react";
import AppNav from "../../../../components/navbar/app";
import {Text} from "@chakra-ui/react";

function HomePage({token, dataProps}) {
    const {state: appReady, stateSetter: setAppReady} = dataProps.appReady
    const {state: guilds, stateSetter: setGuilds} = dataProps.userGuilds
    const {state: userData, stateSetter: setUserData} = dataProps.userData

    const router = useRouter();

    useEffect(() => {
        (async () => {
            setTimeout(async () => {
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

                } catch (e) {
                    console.log("API Error: " + e);
                    setAppReady(false);
                }
            }, 3000);
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
                        <Text>This page is a work in progress</Text>
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

export default HomePage;