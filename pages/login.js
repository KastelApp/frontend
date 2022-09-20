import Head from "next/head";
import NavBar_Home from "../components/navbar/home";
import {Box, Button, Container, Heading, Icon, Input, Stack, Text, useBreakpointValue,} from '@chakra-ui/react';
import NextLink from 'next/link'
import {useRouter} from "next/router";
import {useEffect} from "react";

function LoginPage() {

    const router = useRouter();

    useEffect(() => {
        router.prefetch('/app')
        router.prefetch('/reset-password')
        router.prefetch('/register')
    }, [])

    return (
        <>
            <Head>
                <title>Kastel - Login</title>
            </Head>

            <NavBar_Home/>

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
                            bg={'gray.50'}
                            rounded={'xl'}
                            p={{base: 4, sm: 6, md: 8}}
                            spacing={{base: 8}}
                            maxW={{lg: 'lg'}}>
                            <Box as={'form'} mt={5}>
                                <Stack spacing={4}>
                                    <Input
                                        placeholder="hello@example.com"
                                        bg={'gray.100'}
                                        border={0}
                                        color={'gray.500'}
                                        _placeholder={{
                                            color: 'gray.500',
                                        }}
                                    />
                                    <Input
                                        placeholder="CoolPassword123!"
                                        bg={'gray.100'}
                                        border={0}
                                        color={'gray.500'}
                                        _placeholder={{
                                            color: 'gray.500',
                                        }}
                                    />
                                </Stack>

                                <Button
                                    fontFamily={'heading'}
                                    mt={8}
                                    w={'full'}
                                    bgGradient="linear(to-r, red.400,pink.400)"
                                    color={'white'}
                                    _hover={{
                                        bgGradient: 'linear(to-r, red.400,pink.400)',
                                        boxShadow: 'xl',
                                    }}>
                                    Submit
                                </Button>
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
                <Blur
                    position={'absolute'}
                    top={-10}
                    left={-10}
                    style={{filter: 'blur(70px)'}}
                />
            </Box>
        </>
    )
}

export const Blur = (props) => {
    return (
        <Icon
            width={useBreakpointValue({base: '100%', md: '40vw', lg: '30vw'})}
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