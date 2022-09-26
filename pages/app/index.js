import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import * as api from "../../utils/api";
import {getCookie} from 'cookies-next';
import {Flex, Heading, Stack, Text} from "@chakra-ui/react";
import quotes from '../../data/quotes.js';

function HomePage({token, user}) {
    const router = useRouter();
    const [quote, setQuote] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            setTimeout(async () => {
                try {
                    let userInfo = await api.fetchUser(token);
                    console.log(userInfo);
                    if (userInfo.errors) {
                        // something here
                    }

                    if (userInfo.data) {
                        // something here
                        router.push('/app/@me');
                    }

                } catch (e) {
                    console.log("API Error: " + e);
                   setError(true)
                }
            }, 3000);
        })();
    }, [])

    useEffect(() => {
        console.log('Want to add your quote? Go to: https://github.com/Kastelll/frontend/blob/master/data/quotes.js');
        setQuote(quotes[Math.floor(Math.random() * quotes.length)])

        let second = setInterval(() => {

            setQuote(quotes[Math.floor(Math.random() * quotes.length)])

        }, 3000);

        return () => {
            clearInterval(second)
        }

    }, [])

    return (
        <>
            <Head>
                <title>Kastel App</title>
            </Head>

            {/* Loading Page */}

            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}>

                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading bgGradient="linear(to-r, red.400,pink.400)"
                                 bgClip="text" fontSize={'5xl'}>Kastel</Heading>
                        <Text fontSize={'2xl'} color={'gray.600'}>
                            {quote}
                        </Text>
                    </Stack>
                </Stack>

            </Flex>

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