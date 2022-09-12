import Head from "next/head";
import NavBar_Home from "../components/navbar/home";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

function LoginPage() {
    return (
        <>
            <Head>
                <title>Kastel - Login</title>
            </Head>

            <NavBar_Home/>
        </>
    )
}

export default LoginPage;