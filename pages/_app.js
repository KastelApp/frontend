import {ChakraProvider} from '@chakra-ui/react'
import theme from "../utils/theme";
import NProgress from 'nprogress';
import {debounce} from 'lodash';
import RouterEvents from "../utils/router-events";
import {useState} from "react";
import '../styles/globals.css';
import Head from 'next/head';
import Script from "next/script";

const start = debounce(NProgress.start, 100);
RouterEvents.on('routeChangeStart', start);
RouterEvents.on('routeChangeComplete', (url) => {
    console.log(`Changed to URL: ${url}`);
    start.cancel();
    NProgress.done();
});
RouterEvents.on('routeChangeError', () => {
    start.cancel();
    NProgress.done();
});

function MyApp({Component, pageProps}) {

    const [appReady, setAppReady] = useState(false)
    const [userData, setUserData] = useState(null)
    const [userGuilds, setUserGuilds] = useState(null)

    const dataProps = {
        appReady: {
            state: appReady,
            stateSetter: setAppReady
        },
        userData: {
            state: userData,
            stateSetter: setUserData
        },
        userGuilds: {
            state: userGuilds,
            stateSetter: setUserGuilds
        }
    }

    return (
        <ChakraProvider theme={theme}>
            {process.env.NODE_ENV === 'production' && (
                <Script async defer data-website-id="83dba013-b17b-45c2-a9bd-9f81d2a63c1c"
                        src="https://analytics.kastelapp.com/umami.js"></Script>
            )}
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"/>
            </Head>
            <Component {...pageProps} dataProps={dataProps}/>
        </ChakraProvider>
    )
}

export default MyApp