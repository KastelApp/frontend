import Head from "next/head";
import NavBar_Home from "../components/navbar/home";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {getCookie} from "cookies-next";
import Script from "next/script";
import {Box, Container, Heading, Stack, Text} from "@chakra-ui/react";

function Branding({user}) {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/login')
    }, [])

    return (
        <>
            {process.env.NODE_ENV === 'production' && (
                <Script async defer data-website-id="83dba013-b17b-45c2-a9bd-9f81d2a63c1c"
                        src="https://analytics.kastelapp.com/umami.js"></Script>
            )}
            <Head>
                <title>Kastel - Branding</title>
            </Head>

            <NavBar_Home user={user}/>

            <Box p={4}>
                <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
                    <Heading fontSize={{base: '2xl', sm: '4xl'}} fontWeight={'bold'}>
                        Branding
                    </Heading>
                    <Text color={'gray.600'} fontSize={{base: 'sm', sm: 'lg'}}>
                        Hi there, this is the branding page. Here you can find all the information you need to know
                        about Kastel's branding.
                    </Text>
                </Stack>


            </Box>

        </>
    )
}

export const getServerSideProps = ({req, res}) => {
    return {
        props: {
            user: getCookie('user', {req, res}) || null,
        }
    };
};

export default Branding;