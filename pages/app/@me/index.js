import Head from "next/head";
import {useRouter} from "next/router";
import AppNav from "../../../components/navbar/app";
import {useEffect, useState} from "react";
import * as api from "../../../utils/api";
import {getCookie} from 'cookies-next';

function AtMe_Index({token, user}) {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            let userInfo = await api.fetchUser(token);
            console.log(userInfo);
            if (userInfo.errors) {
                // something here
            }

            if (userInfo.data) {
                // something here
            }
        })();
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

export default AtMe_Index;