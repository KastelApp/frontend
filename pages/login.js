import Head from "next/head";
import NavBar_Home from "../components/navbar/home";
import {
    Box,
    Button,
    Container,
    Heading,
    Icon,
    Input,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link'
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import * as api from "../utils/api";

function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        router.prefetch('/app')
        router.prefetch('/reset-password')
        router.prefetch('/register')
    }, [])

    const login = async event => {
        event.preventDefault();
        setLoading(true);

        let email = event.target.email.value;
        let password = event.target.password.value;

        if (!email) {
            setLoading(false);
            setError([
                {code: "MISSING_EMAIL", message: "Please enter your email address.",}
            ])
        } else if (!password) {
            setLoading(false);
            setError([
                {code: "MISSING_PASSWORD", message: "Please enter your account password",}
            ])
        } else {
            try {
                let response = await api.login({email, password});

                if (response?.responses[0]?.code === 'LOGGED_IN') {
                    setLoading(false);
                    router.push('/app');
                } else if (response.errors) {
                    setLoading(false);
                    setError(response?.errors || [{code: "UNKNOWN", message: "An unknown error occurred."}])
                } else {
                    setLoading(false);
                    setError([
                        {code: "UNKNOWN", message: "An unknown error occurred, check logs."}
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
            <Head>
                <title>Kastel - Login</title>
            </Head>

            <NavBar_Home/>

            <form onSubmit={login}>

                <Box align={'center'}
                     justify={'center'} position={'relative'}>
                    <Container
                        maxW={'7xl'}
                        columns={{base: 1, md: 2}}
                        spacing={{base: 10, lg: 32}}
                        py={{base: 10, sm: 20, lg: 32}}>
                        <>
                            <Heading
                                lineHeight={1.1}
                                fontSize={{base: '3xl', sm: '4xl', md: '5xl', lg: '6xl'}}>
                                Login to{' '}
                                <Text
                                    as={'span'}
                                    bgGradient="linear(to-r, red.400,pink.400)"
                                    bgClip="text">
                                    Kastel!
                                </Text>
                            </Heading>

                            <br/>

                            <Box
                                mt={5}
                                bg={useColorModeValue('gray.100', 'gray.700')}
                                rounded={'xl'}
                                p={{base: 4, sm: 6, md: 8}}
                                spacing={{base: 8}}
                                maxW={{lg: 'lg'}}>
                                <Box mt={5}>
                                    <Stack spacing={4}>

                                        {error && <Text
                                            mt={-3}
                                            as={'span'}
                                            bgGradient="linear(to-r, red.400,pink.400)"
                                            bgClip="text">
                                            {error.map(err => {
                                                return err.message
                                            })}
                                        </Text>}

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
                                            Submitting
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
                                            Submit
                                        </Button>
                                    }

                                    <Stack justify={'center'} mt={2} direction={['column', 'row']}>
                                        <NextLink href={'/register'}>
                                            <Button
                                                fontFamily={'heading'}
                                                w={'full'}
                                                bgGradient="linear(to-r, red.400,pink.400)"
                                                color={'white'}
                                                _hover={{
                                                    bgGradient: 'linear(to-r, red.400,pink.400)',
                                                    boxShadow: 'xl',
                                                }}>
                                                New User
                                            </Button>
                                        </NextLink>

                                        <NextLink href={'/reset-password'}>
                                            <Button
                                                fontFamily={'heading'}
                                                w={'full'}
                                                bgGradient="linear(to-r, red.400,pink.400)"
                                                color={'white'}
                                                _hover={{
                                                    bgGradient: 'linear(to-r, red.400,pink.400)',
                                                    boxShadow: 'xl',
                                                }}>
                                                Reset Password
                                            </Button>
                                        </NextLink>
                                    </Stack>

                                </Box>

                            </Box>

                        </>
                    </Container>
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
            width={useBreakpointValue({base: '100%', md: '40vw', lg: '30vw'},
                {ssr: true})}
            zIndex={useBreakpointValue({base: -1, md: -1, lg: 0})}
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

export default LoginPage;