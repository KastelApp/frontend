import Head from "next/head";
import NavBar_Home from "../components/navbar/home";
import {Box, Button, Heading, Icon, Input, Stack, Text, useBreakpointValue, useColorModeValue} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import * as api from "../utils/api";
import {getCookie, setCookie} from "cookies-next";
import Script from "next/script";

function RegisterPage({user}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        router.prefetch('/app');
        router.prefetch('/reset-password');
        router.prefetch('/login');
    }, [])

    const submit = async event => {
        event.preventDefault();
        setLoading(true);

        let username = event.target.username.value;
        let email = event.target.email.value;
        let password = event.target.password.value;

        if (!username) {
            setLoading(false);
            setError([
                {code: "MISSING_USERNAME", message: "Please enter a username."}
            ])
        } else if (!email) {
            setLoading(false);
            setError([
                {code: "MISSING_EMAIL", message: "Please enter your email address."}
            ])
        } else if (!password) {
            setLoading(false);
            setError([
                {code: "MISSING_PASSWORD", message: "Please enter your account password."}
            ])
        } else {
            try {
                let response = await api.register({username, email, password});
                console.log(response);

                if (response?.Token) {
                    setLoading(false);
                    setCookie('token', response?.Token);

                    router.push('/app');
                } else if (response.Errors) {
                    setLoading(false);
                    setError(response?.Errors || [{code: "UNKNOWN", Message: "An unknown error occurred."}])
                } else {
                    setLoading(false);
                    setError([
                        {code: "UNKNOWN", Message: "An unknown error occurred."}
                    ])
                }



            } catch (error) {
                console.log(error)
                setLoading(false);
                setError([
                    {code: "UNKNOWN", message: "An unknown error occurred, check logs."}
                ])
            }
        }
    }

    return (
        <>
            {process.env.NODE_ENV === 'production' && (
                <Script async defer data-website-id="83dba013-b17b-45c2-a9bd-9f81d2a63c1c"
                        src="https://analytics.kastelapp.com/umami.js"></Script>
            )}
            <Head>
                <title>Kastel - Register</title>
            </Head>

            <NavBar_Home user={user}/>

            <form onSubmit={submit}>
                <Box align={'center'}
                     justify={'center'} position={'relative'}>

                    <Stack
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        rounded={'xl'}
                        p={{base: 4, sm: 6, md: 8}}
                        spacing={{base: 8}}
                        maxW={{lg: 'lg'}}>
                        <Stack spacing={4}>
                            <Heading
                                color={useColorModeValue('gray.800', 'gray.100')}
                                lineHeight={1.1}
                                fontSize={{base: '2xl', sm: '3xl', md: '4xl'}}>
                                Join our platform
                                <Text
                                    as={'span'}
                                    bgGradient="linear(to-r, red.400,pink.400)"
                                    bgClip="text">
                                    !
                                </Text>
                            </Heading>

                            {error ? (
                                <Text bgGradient="linear(to-r, red.400,pink.400)"
                                      bgClip="text"
                                      fontSize={{base: 'sm', sm: 'md'}}>
                                    {(Object.values(error)?.[0]?.Message) || 'Unknown error occurred.'}
                                </Text>
                            ) : (
                                <Text _dark={{color: "gray.200"}} color={'gray.500'}
                                      fontSize={{base: 'sm', sm: 'md'}}>
                                    We are a platform for everyone! Want to know more?{' '} ...
                                </Text>
                            )}
                        </Stack>
                        <Box mt={10}>
                            <Stack spacing={4}>
                                <Input
                                    id={'username'}
                                    required={true}
                                    type={'text'}
                                    bg={useColorModeValue('gray.200', 'gray.600')}
                                    placeholder="Username"
                                    border={0}
                                    color={useColorModeValue('gray.900', 'gray.100')}
                                    _placeholder={{
                                        color: useColorModeValue('gray.500', 'gray.100'),
                                    }}
                                />
                                <Input
                                    id={'email'}
                                    required={true}
                                    type={'email'}
                                    placeholder="hello@example.com"
                                    bg={useColorModeValue('gray.200', 'gray.600')}
                                    border={0}
                                    color={useColorModeValue('gray.900', 'gray.100')}
                                    _placeholder={{
                                        color: useColorModeValue('gray.500', 'gray.100'),
                                    }}
                                />
                                <Input
                                    id={'password'}
                                    required={true}
                                    type={'password'}
                                    placeholder="CoolPassword123!"
                                    bg={useColorModeValue('gray.200', 'gray.600')}
                                    border={0}
                                    color={useColorModeValue('gray.900', 'gray.100')}
                                    _placeholder={{
                                        color: useColorModeValue('gray.500', 'gray.100'),
                                    }}
                                />
                            </Stack>

                            {loading ?
                                <Button
                                    isLoading
                                    fontFamily={'heading'}
                                    mt={8}
                                    w={'full'}
                                    _hover={{
                                        bgGradient: 'linear(to-r, red.400,pink.400)',
                                        boxShadow: 'xl',
                                    }}
                                    bgGradient="linear(to-r, red.400,pink.400)"
                                    color={'white'}>
                                    Registering
                                </Button>
                                :
                                <Button
                                    type={'submit'}
                                    fontFamily={'heading'}
                                    mt={8}
                                    w={'full'}
                                    _hover={{
                                        bgGradient: 'linear(to-r, red.400,pink.400)',
                                        boxShadow: 'xl',
                                    }}
                                    bgGradient="linear(to-r, red.400,pink.400)"
                                    color={'white'}>
                                    Register
                                </Button>
                            }

                        </Box>
                        form
                    </Stack>
                    <Blur/>
                </Box>
            </form>
        </>
    )
}

export const Blur = (props) => {
    return (
        <Icon
            position={'absolute'}
            top={-10}
            left={-10}
            style={{filter: 'blur(70px)'}}
            css={{pointerEvents: "none"}}
            width={useBreakpointValue({base: '100%', md: '40vw', lg: '30vw'},
                {ssr: true})}
            zIndex={useBreakpointValue({base: -1, md: -1, lg: 0},
                {ssr: true})}
            height="560px"
            viewBox="0 0 528 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <circle cx="71" cy="61" r="111" fill="#F56565"/>
            <circle cx="244" cy="106" r="139" fill="#ED64A6"/>
            <circle cy="291" r="139" fill="#ED64A6"/>
            <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936"/>
            <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B"/>
            <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78"/>
            <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1"/>
        </Icon>
    );
};

export const getServerSideProps = ({req, res}) => {
    let user = getCookie('token', {req, res}) || null;

    if (user) {
        return {
            redirect: {
                destination: '/app',
                permanent: false,
            },
        }
    }

    return {
        props: {
            user: getCookie('token', {req, res}) || null,
        }
    };
};

export default RegisterPage;
