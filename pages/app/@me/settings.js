import Head from "next/head";
import {useRouter} from "next/router";
import AppNav from "../../../components/navbar/app/index";
import {useEffect} from "react";
import * as api from "../../../utils/api";
import {getCookie} from 'cookies-next';
import LoadingPage from "../../../components/app/loading-page";
import {UserSocket} from "../../../utils/ws/userSocket";
import {
    chakra,
    Avatar,
    Box, Button, Divider, Flex,
    FormControl, FormHelperText,
    FormLabel,
    GridItem,
    Heading, Icon, Input,
    InputGroup,
    InputLeftAddon,
    SimpleGrid,
    Stack, Textarea, VisuallyHidden,
    Text, Select, Checkbox, Radiogroup, RadioGroup, Radio
} from "@chakra-ui/react";
import {FaUser} from "react-icons/fa";

function AtMe_Settings({token, dataProps}) {
    const router = useRouter();
    const {state: appReady, stateSetter: setAppReady} = dataProps.appReady
    const {state: userData, stateSetter: setUserData} = dataProps.userData

    useEffect(() => {
        (async () => {
            try {
                const WS = new UserSocket(token, '1', 'json')
                const userData = await WS.connect();

                setUserData(userData);
                setAppReady(true);
            } catch (e) {
                console.log("Error: ");
                setAppReady(false);
                console.log(e)
                if (e.message === 'Invalid token') {
                    router.push('/app/logout?redirect=/login')
                } else {
                    router.push('/app/logout');
                }
            }
        })();
    }, [])

    return (
        <>
            <Head>
                <title>Kastel App</title>
            </Head>

            {appReady ? (
                <>
                    <AppNav userInfo={userData}>

                        <Box
                            p={10}
                        >
                            <Box>
                                <SimpleGrid
                                    display={{
                                        base: "initial",
                                        md: "grid",
                                    }}
                                    columns={{
                                        md: 3,
                                    }}
                                    spacing={{
                                        md: 6,
                                    }}
                                >
                                    <GridItem
                                        colSpan={{
                                            md: 1,
                                        }}
                                    >
                                        <Box px={[4, 0]}>
                                            <Heading fontSize="lg" fontWeight="md" lineHeight="6">
                                                Profile
                                            </Heading>
                                            <Text
                                                mt={1}
                                                fontSize="sm"
                                                color="gray.600"
                                                _dark={{
                                                    color: "gray.400",
                                                }}
                                            >
                                                This information will be displayed publicly so be careful what you
                                                share.
                                            </Text>
                                        </Box>
                                    </GridItem>
                                    <GridItem
                                        mt={[5, null, 0]}
                                        colSpan={{
                                            md: 2,
                                        }}
                                    >
                                        <chakra.form
                                            method="POST"
                                            shadow="base"
                                            rounded={[null, "md"]}
                                            overflow={{
                                                sm: "hidden",
                                            }}
                                        >
                                            <Stack
                                                px={4}
                                                py={5}

                                                spacing={6}
                                                p={{
                                                    sm: 6,
                                                }}
                                            >


                                                <div>
                                                    <FormControl id="email" mt={1}>
                                                        <FormLabel
                                                            fontSize="sm"
                                                            fontWeight="md"
                                                            color="gray.700"
                                                            _dark={{
                                                                color: "gray.50",
                                                            }}
                                                        >
                                                            About
                                                        </FormLabel>
                                                        <Textarea
                                                            placeholder="you@example.com"
                                                            mt={1}
                                                            rows={3}
                                                            shadow="sm"
                                                            focusBorderColor="brand.400"
                                                            fontSize={{
                                                                sm: "sm",
                                                            }}
                                                        />
                                                        <FormHelperText>
                                                            Brief description for your profile. URLs are hyperlinked.
                                                        </FormHelperText>
                                                    </FormControl>
                                                </div>

                                                <FormControl>
                                                    <FormLabel
                                                        fontSize="sm"
                                                        fontWeight="md"
                                                        color="gray.700"
                                                        _dark={{
                                                            color: "gray.50",
                                                        }}
                                                    >
                                                        Photo
                                                    </FormLabel>
                                                    <Flex alignItems="center" mt={1}>
                                                        <Avatar
                                                            boxSize={12}
                                                            bg="gray.100"
                                                            _dark={{
                                                                bg: "gray.800",
                                                            }}
                                                            icon={
                                                                <Icon
                                                                    as={FaUser}
                                                                    boxSize={9}
                                                                    mt={3}
                                                                    rounded="full"
                                                                    color="gray.300"
                                                                    _dark={{
                                                                        color: "gray.700",
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                        <Button
                                                            type="button"
                                                            ml={5}
                                                            variant="outline"
                                                            size="sm"
                                                            fontWeight="medium"
                                                            _focus={{
                                                                shadow: "none",
                                                            }}
                                                        >
                                                            Change
                                                        </Button>
                                                    </Flex>
                                                </FormControl>


                                            </Stack>
                                            <Box
                                                px={{
                                                    base: 4,
                                                    sm: 6,
                                                }}
                                                py={3}
                                                textAlign="right"
                                            >
                                                <Button
                                                    type="submit"
                                                    colorScheme="brand"
                                                    _focus={{
                                                        shadow: "",
                                                    }}
                                                    fontWeight="md"
                                                >
                                                    Save
                                                </Button>
                                            </Box>
                                        </chakra.form>
                                    </GridItem>
                                </SimpleGrid>
                            </Box>

                            <Divider
                                my="5"
                                borderColor="gray.300"
                                _dark={{
                                    borderColor: "whiteAlpha.300",
                                }}
                                visibility={{
                                    base: "hidden",
                                    sm: "visible",
                                }}
                            />

                            <Box mt={[10, 0]}>
                                <SimpleGrid
                                    display={{
                                        base: "initial",
                                        md: "grid",
                                    }}
                                    columns={{
                                        md: 3,
                                    }}
                                    spacing={{
                                        md: 6,
                                    }}
                                >
                                    <GridItem
                                        colSpan={{
                                            md: 1,
                                        }}
                                    >
                                        <Box px={[4, 0]}>
                                            <Heading fontSize="lg" fontWeight="medium" lineHeight="6">
                                                Personal Information
                                            </Heading>
                                            <Text
                                                mt={1}
                                                fontSize="sm"
                                                color="gray.600"
                                                _dark={{
                                                    color: "gray.400",
                                                }}
                                            >
                                                Use a permanent address where you can receive mail.
                                            </Text>
                                        </Box>
                                    </GridItem>
                                    <GridItem
                                        mt={[5, null, 0]}
                                        colSpan={{
                                            md: 2,
                                        }}
                                    >
                                        <chakra.form
                                            method="POST"
                                            shadow="base"
                                            rounded={[null, "md"]}
                                            overflow={{
                                                sm: "hidden",
                                            }}
                                        >
                                            <Stack
                                                px={4}
                                                py={5}
                                                p={[null, 6]}
                                                bg="white"
                                                _dark={{
                                                    bg: "#141517",
                                                }}
                                                spacing={6}
                                            >
                                                <SimpleGrid columns={6} spacing={6}>
                                                    <FormControl as={GridItem} colSpan={[6, 3]}>
                                                        <FormLabel
                                                            htmlFor="first_name"
                                                            fontSize="sm"
                                                            fontWeight="md"
                                                            color="gray.700"
                                                            _dark={{
                                                                color: "gray.50",
                                                            }}
                                                        >
                                                            First name
                                                        </FormLabel>
                                                        <Input
                                                            type="text"
                                                            name="first_name"
                                                            id="first_name"
                                                            autoComplete="given-name"
                                                            mt={1}
                                                            focusBorderColor="brand.400"
                                                            shadow="sm"
                                                            size="sm"
                                                            w="full"
                                                            rounded="md"
                                                        />
                                                    </FormControl>

                                                    <FormControl as={GridItem} colSpan={[6, 3]}>
                                                        <FormLabel
                                                            htmlFor="last_name"
                                                            fontSize="sm"
                                                            fontWeight="md"
                                                            color="gray.700"
                                                            _dark={{
                                                                color: "gray.50",
                                                            }}
                                                        >
                                                            Last name
                                                        </FormLabel>
                                                        <Input
                                                            type="text"
                                                            name="last_name"
                                                            id="last_name"
                                                            autoComplete="family-name"
                                                            mt={1}
                                                            focusBorderColor="brand.400"
                                                            shadow="sm"
                                                            size="sm"
                                                            w="full"
                                                            rounded="md"
                                                        />
                                                    </FormControl>

                                                    <FormControl as={GridItem} colSpan={[6, 4]}>
                                                        <FormLabel
                                                            htmlFor="email_address"
                                                            fontSize="sm"
                                                            fontWeight="md"
                                                            color="gray.700"
                                                            _dark={{
                                                                color: "gray.50",
                                                            }}
                                                        >
                                                            Email address
                                                        </FormLabel>
                                                        <Input
                                                            type="text"
                                                            name="email_address"
                                                            id="email_address"
                                                            autoComplete="email"
                                                            mt={1}
                                                            focusBorderColor="brand.400"
                                                            shadow="sm"
                                                            size="sm"
                                                            w="full"
                                                            rounded="md"
                                                        />
                                                    </FormControl>

                                                </SimpleGrid>
                                            </Stack>
                                            <Box
                                                px={{
                                                    base: 4,
                                                    sm: 6,
                                                }}
                                                py={3}
                                                bg="gray.50"
                                                _dark={{
                                                    bg: "#121212",
                                                }}
                                                textAlign="right"
                                            >
                                                <Button
                                                    type="submit"
                                                    colorScheme="brand"
                                                    _focus={{
                                                        shadow: "",
                                                    }}
                                                    fontWeight="md"
                                                >
                                                    Save
                                                </Button>
                                            </Box>
                                        </chakra.form>
                                    </GridItem>
                                </SimpleGrid>
                            </Box>

                        </Box>


                    </AppNav>
                </>
            ) : (
                <LoadingPage user={userData} token={token} appReady={appReady}/>
            )}

        </>
    )
}

export const getServerSideProps = ({req, res}) => {
    let token = getCookie('token', {req, res}) || null;

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    return {
        props: {
            token: getCookie('token', {req, res}) || null
        }
    };
};

export default AtMe_Settings;