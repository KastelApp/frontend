import quotes from "../../data/quotes";
import {Flex, Heading, Stack, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";

export default function LoadingPage({token, user, appReady}) {
    const [quote, setQuote] = useState('');

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