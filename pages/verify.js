import Head from "next/head";
import NavBar_Home from "../components/navbar/home";
import {getCookie} from "cookies-next";
import Script from "next/script";
import {Heading, Spinner, VStack, Text} from "@chakra-ui/react";
import {CheckCircleIcon, CloseIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import * as api from "../utils/api";


function HomePage({user}) {
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('loading') // 'loading', 'success', 'error'
    const Token = useRouter()?.query?.token;

    useEffect( () => {
        (async () => {
            console.log(Token)

            try {
                let request = await api.VerifyEmail(Token);
                console.log(request)
                if (request.Errors) {
                    setStatus('error')
                    setError(request?.Errors || [{code: "UNKNOWN", Message: "An unknown error occurred."}])
                } else {
                    setStatus('success')
                }
            } catch (e) {
                setStatus('error')
                setError([{code: "UNKNOWN", Message: "An unknown error occurred."}])
            }

        })()
    }, [])

    return (
        <>
            {process.env.NODE_ENV === 'production' && (
                <Script async defer data-website-id="83dba013-b17b-45c2-a9bd-9f81d2a63c1c"
                        src="https://analytics.kastelapp.com/umami.js"></Script>
            )}
            <Head>
                <title>Kastel</title>
            </Head>

            <NavBar_Home user={user}/>

            <VStack
                justify='center'
                spacing='4'
                as='section'
                mt={['20', null, '40']}
                textAlign='center'
            >
                {status === 'loading' && (
                    <Spinner boxSize={'50px'} />
                )}
                {status === 'success' && (
                    <CheckCircleIcon boxSize={'50px'} color={'green.500'}/>
                )}
                {status === 'error' && (
                    <CloseIcon boxSize={'50px'} color={'red.500'}/>
                )}
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    {status === 'loading' && 'Awaiting Verification...'}
                    {status === 'success' && 'Email has been verified'}
                    {status === 'error' && 'Error verifying email'}
                </Heading>

                {status === 'success' && (
                    <Text color={'gray.500'}>
                        You can now close this page.
                    </Text> )}

                {status === 'error' && (
                    <Text color={'gray.500'}>
                        {(Object?.values(error)[0]?.Message) || 'Unknown error occurred.'}
                    </Text> )}

            </VStack>


        </>
    )
}

export const getServerSideProps = ({req, res}) => {
    return {
        props: {
            user: getCookie('token', {req, res}) || null,
        }
    };
};

export default HomePage;