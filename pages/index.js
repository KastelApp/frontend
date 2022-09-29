import Head from "next/head";
import NavBar_Home from "../components/navbar/home";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {getCookie} from "cookies-next";
import {Box, Button, Container, Stack, Text, chakra, Divider} from "@chakra-ui/react";
import NextLink from "next/link";
import {DiGithubBadge} from "react-icons/di";
import {FaArrowRight} from "react-icons/fa";

function HomePage({user}) {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/login')
    }, [])

    return (
        <>
            <Head>
                <title>Kastel</title>
            </Head>

            <NavBar_Home user={user}/>


            <Box mb={20}>

                {/* welcome content */}

                <Box as='section' pt='6rem' pb={{ base: '0', md: '5rem' }}>
                    <Container>
                        <Box textAlign='center'>
                            <chakra.h1
                                maxW='16ch'
                                mx='auto'
                                fontSize={{ base: '2.25rem', sm: '3rem', lg: '4rem' }}
                                fontFamily='heading'
                                letterSpacing='tighter'
                                fontWeight='extrabold'
                                mb='16px'
                                lineHeight='1.2'
                            >
                                Welcome to
                                <Box as='span' bgGradient="linear(to-r, red.400,pink.400)"
                                     bgClip="text">
                                    {' '}
                                    Kastel
                                </Box>
                            </chakra.h1>

                            <Text
                                maxW='560px'
                                mx='auto'
                                color='gray.500'
                                _dark={{ color: 'gray.400' }}
                                fontSize={{ base: 'lg', lg: 'xl' }}
                                mt='6'
                            >
                                Small Test Message
                            </Text>

                            <Stack
                                mt='10'
                                spacing='4'
                                justify='center'
                                direction={{ base: 'column', sm: 'row' }}
                            >
                                <NextLink href='/register' passHref>
                                    <Button
                                        h='4rem'
                                        px='40px'
                                        fontSize='1.2rem'
                                        as='a'
                                        size='lg'
                                        bgGradient="linear(to-r, red.400,pink.400)"
                                        _hover={{
                                            bgGradient: 'linear(to-r, red.400,pink.400)',
                                            boxShadow: 'xl',
                                        }}
                                        rightIcon={<FaArrowRight fontSize='0.8em' />}
                                    >
                                        Get Started!
                                    </Button>
                                </NextLink>
                            </Stack>
                        </Box>
                    </Container>
                </Box>

                {/* more content */}


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

export default HomePage;