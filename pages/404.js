import Head from "next/head";
import NavBar_Home from "../components/navbar/home";
import { Button, Heading, Text, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { FaHome } from 'react-icons/fa'

function NotFoundPage() {

    return (
        <>
            <Head>
                <title>Kastel - Page not Found</title>
            </Head>

            <NavBar_Home/>

            <VStack
                justify='center'
                spacing='4'
                as='section'
                mt={['20', null, '40']}
                textAlign='center'
            >
                <Heading>404 | Page Not Found</Heading>
                <Text fontSize={{ md: 'xl' }}>You just hit a route that doesn't exist... the sadness.😢</Text>
                <NextLink href='/' passHref>
                    <Button
                        as='a'
                        aria-label='Back to Home'
                        leftIcon={<FaHome />}
                        colorScheme='teal'
                        size='lg'
                    >
                        Back to Home
                    </Button>
                </NextLink>
            </VStack>
        </>
    )
}

export default NotFoundPage ;