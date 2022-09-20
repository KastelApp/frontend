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
    useBreakpointValue
} from "@chakra-ui/react";

function RegisterPage() {
    return (
        <>
            <Head>
                <title>Kastel - Register</title>
            </Head>

            <NavBar_Home/>

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
                        bg={'gray.50'}
                        rounded={'xl'}
                        p={{base: 4, sm: 6, md: 8}}
                        spacing={{base: 8}}
                        maxW={{lg: 'lg'}}>
                        <Stack spacing={4}>
                            <Heading
                                color={'gray.800'}
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
                            <Text color={'gray.500'} fontSize={{base: 'sm', sm: 'md'}}>
                                We are a platform for everyone! Want to know more?{' '} ...
                            </Text>
                        </Stack>
                        <Box as={'form'} mt={10}>
                            <Stack spacing={4}>
                                <Input
                                    placeholder="Username"
                                    bg={'gray.100'}
                                    border={0}
                                    color={'gray.500'}
                                    _placeholder={{
                                        color: 'gray.500',
                                    }}
                                />
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
                                <Input
                                    placeholder="Age"
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
                        </Box>
                        form
                    </Stack>
                </Container>
                <Blur/>
            </Box>

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
                { ssr: true })}
            zIndex={useBreakpointValue({base: -1, md: -1, lg: 0},
                { ssr: true })}
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

export default RegisterPage;