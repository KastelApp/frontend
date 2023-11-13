import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "@/components/seo";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Box, Button, Container, Heading, Input, Stack, Text, useColorModeValue} from "@chakra-ui/react";
import NextLink from "next/link";
import Layout from "@/components/layout";

const confetti = {
    light: {
        primary: '4299E1', // blue.400
        secondary: 'BEE3F8', // blue.100
    },

    dark: {
        primary: '1A365D', // blue.900
        secondary: '2A4365', // blue.800
    },
};

export default function Home() {
    const {t, i18n} = useTranslation('common')

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
        setError(null);

        const body = {
            email: event.target.email.value,
            password: event.target.password.value,
        };

    }

    return (
        <>
            <SEO
                title={t('signIn')}
            />

            <Layout>
                <form onSubmit={login}>

                    <Box align={'center'}
                         justify={'center'} position={'relative'}>
                        <Container
                            maxW={'7xl'}
                            columns={{base: 1, md: 2}}>
                            <>
                                <Heading
                                    lineHeight={1.1}
                                    fontSize={{base: '3xl', sm: '4xl', md: '5xl', lg: '6xl'}}>
                                    {t('signIn')}{' '}
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
                                                {(Object.values(error)?.[0]?.Message) || 'Unknown error occurred.'}
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
                                                    {t('register')}
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
                                                    {t('forgotPass')}
                                                </Button>
                                            </NextLink>
                                        </Stack>

                                    </Box>

                                </Box>

                            </>

                        </Container>

                    </Box>
                </form>
            </Layout>
        </>
    )
}

export const getStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'en', [
            'common',
        ])),
    },
})