import Head from "next/head";
import {useRouter} from "next/router";
import AppNav from "../../../components/navbar/app";
import {useEffect} from "react";
import * as api from "../../../utils/api";
import {getCookie} from 'cookies-next';
import LoadingPage from "../../../components/app/loading-page";

function AtMe_Settings({token, dataProps}) {
    const router = useRouter();
    const {state: appReady, stateSetter: setAppReady} = dataProps.appReady
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
                    setError(true)
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
                    <AppNav userInfo={userData}/>


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

export default AtMe_Settings;