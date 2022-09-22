import Head from "next/head";
import NavBar_Home from "../components/navbar/home";
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Icon,
    Input,
    SimpleGrid,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue
} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import * as api from "../utils/api";
import {getCookie} from "cookies-next";

function RegisterPage({user}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        router.prefetch('/app')
        router.prefetch('/reset-password')
        router.prefetch('/login')
    }, [])

    const submit = async event => {
        event.preventDefault();
        setLoading(true);

        let username = event.target.username.value;
        let email = event.target.email.value;
        let password = event.target.password.value;
        let dob = event.target.dob.value;

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
        } else if (!dob) {
            setLoading(false);
            setError([
                {code: "MISSING_PASSWORD", message: "Please enter your a date of birth for your account."}
            ])
        } else {
            try {
                let response = await api.register({username, email, password, date_of_birth: dob});
                console.log(response);

                if (response?.responses[0]?.code === 'ACCOUNT_CREATED') {
                    setLoading(false);
                    router.push('/login');
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
                <title>Kastel - Register</title>
            </Head>

            <NavBar_Home user={user}/>

            <form onSubmit={submit}>
                <Box position={'relative'}>
                    <Container
                        as={SimpleGrid}
                        maxW={'7xl'}
                        columns={{base: 1, md: 2}}
                        spacing={{base: 10, lg: 32}}
                        py={{base: 10, sm: 20, lg: 32}}>
                        <Stack spacing={{base: 10, md: 20}}>
                            <Heading
                                lineHeight={1.1}
                                fontSize={{base: '3xl', sm: '4xl', md: '5xl', lg: '6xl'}}>
                                Welcome to{' '}
                                <Text
                                    as={'span'}
                                    bgGradient="linear(to-r, red.400,pink.400)"
                                    bgClip="text">
                                    Kastel!
                                </Text>
                            </Heading>
                            <Stack direction={'row'} spacing={2} align={'center'}>
                                <Text fontFamily={'heading'} fontSize={{base: '3xl', md: '4xl'}}>
                                    A new chat platform for everyone.
                                </Text>
                                <Text fontFamily={'heading'} fontSize={{base: '4xl', md: '6xl'}}>
                                    +
                                </Text>
                                <Flex
                                    align={'center'}
                                    justify={'center'}
                                    fontFamily={'heading'}
                                    fontSize={{base: 'sm', md: 'lg'}}
                                    bg={'gray.800'}
                                    color={'white'}
                                    rounded={'full'}
                                    width={useBreakpointValue({base: '45px', md: '65px'})}
                                    height={useBreakpointValue({base: '45px', md: '65px'})}
                                    position={'relative'}
                                    _before={{
                                        content: '""',
                                        width: 'full',
                                        height: 'full',
                                        rounded: 'full',
                                        transform: 'scale(1.125)',
                                        bgGradient: 'linear(to-bl, orange.400,yellow.400)',
                                        position: 'absolute',
                                        zIndex: -1,
                                        top: 0,
                                        left: 0,
                                    }}>
                                    YOU
                                </Flex>
                            </Stack>
                        </Stack>
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
                                        {error.map(err => {
                                            return err.message
                                        })}
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
                                    <Input
                                        id={'dob'}
                                        required={true}
                                        type={'date'}
                                        placeholder="Age"
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
    let user = getCookie('user', {req, res}) || null;

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
            user: getCookie('user', {req, res}) || null,
        }
    };
};

export default RegisterPage;