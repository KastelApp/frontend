import {ChakraProvider} from '@chakra-ui/react'
import theme from "../utils/theme";
import {useState} from "react";
import '../styles/globals.css';
import Head from 'next/head';

function MyApp({Component, pageProps}) {

    const [appReady, setAppReady] = useState(false)
    const [userData, setUserData] = useState(null)

    const dataProps = {
        appReady: {
            state: appReady,
            stateSetter: setAppReady
        },
        userData: {
            state: userData,
            stateSetter: setUserData
        },
    }

    return (
        <ChakraProvider theme={theme}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"/>
            </Head>
            <Component {...pageProps} dataProps={dataProps}/>
        </ChakraProvider>
    )
}

export default MyApp