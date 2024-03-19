import SEO from "@/components/seo";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import {
    Box,
    Button,
    Container,
    Heading,
    Input,
    Stack,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import Layout from "@/components/layout";
import { useClientStore, useTokenStore } from "@/utils/stores";
import Navbar from "@/components/navbar";
import t from "$/utils/typeCheck.ts";
import Link from "next/link";

const ResetPassword = () => {
    const router = useRouter();

    const {
        id,
        token
    } = router.query as {
        id: string;
        token: string;
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<
        {
            code: string;
            message: string;
        }[]
    >([]);
    const { client } = useClientStore();

    const bg = useColorModeValue("gray.200", "#1A202C");
    const color = useColorModeValue("gray.900", "gray.100");
    const hoverColor = useColorModeValue("#000b2e", "#d1dcff");
    const { setToken } = useTokenStore();

    useEffect(() => {
        router.prefetch("/app");
        router.prefetch("/login");
        router.prefetch("/register");
    }, []);

    useEffect(() => {

        if (!client || !id || !token) return;

        const verify = async () => {
            const verified = await client.valdateAuth({
                id,
                token
            });

            if (!verified) {
                router.push("/login");
            }
        };

        verify();
    }, [
        id,
        token,
        client
    ]);

    const changePassword = async (
        event: FormEvent<HTMLFormElement> & {
            target: {
                password: {
                    value: string;
                };
            };
        },
    ) => {
        event.preventDefault();
        setLoading(true);
        setError([]);

        const password = event.target.password.value;

        if (!t(password, "string") || password.length < 4 || password.length > 72) {
            setError([{ code: "INVALID_PASSWORD", message: "Invalid password. Must be between 4 and 72 characters" }]);
            setLoading(false);

            return;
        }

        const resetResponse = await client.changePassword({
            id,
            token,
            resetClient: true,
            newPassword: password
        });

        if (resetResponse.success) {
            setToken(resetResponse.token!);

            client.connect(resetResponse.token!);

            router.push("/app");

            return;
        }

        setError([{ code: "UNKNOWN", message: "An error occurred." }]);
        setLoading(false);
    };

    return (
        <>
            <SEO title={"Reset Password"} />
            <Navbar />
            <Layout>
                <form onSubmit={changePassword} id={"reset-password"}>
                    {/* @ts-expect-error -- idk */}
                    <Box align={"center"} justify={"center"} position={"relative"}>
                        {/* @ts-expect-error -- idk */}
                        <Container maxW={"7xl"} columns={{ base: 1, md: 2 }}>
                            <>
                                <Heading
                                    lineHeight={1.1}
                                    fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                                >
                                    Change Your Password
                                </Heading>

                                <br />

                                <Box
                                    mt={5}
                                    bg={useColorModeValue("gray.100", "#2D3748")}
                                    rounded={"xl"}
                                    p={{ base: 4, sm: 6, md: 8 }}
                                    //  @ts-expect-error -- idk
                                    spacing={{ base: 8 }}
                                    maxW={{ lg: "lg" }}
                                >
                                    <Box mt={5}>
                                        <Stack spacing={4}>
                                            {error.length > 0 && (
                                                <Text
                                                    mt={-3}
                                                    as={"span"}
                                                    bgGradient={error[0].code === "Success" ? "linear(to-r, green.400,green.400)" : "linear(to-r, red.400,pink.400)"}
                                                    bgClip="text"
                                                >
                                                    {error.map((err) => {
                                                        return err.message;
                                                    })}
                                                </Text>
                                            )}

                                            <Input
                                                id={"password"}
                                                required={true}
                                                type={"password"}
                                                placeholder="New Password"
                                                bg={bg}
                                                border={0}
                                                color={color}
                                                _placeholder={{
                                                    color: hoverColor,
                                                }}
                                                autoComplete="new-password"
                                            />
                                        </Stack>

                                        {loading ? (
                                            <Button
                                                isLoading
                                                fontFamily={"heading"}
                                                mt={8}
                                                w={"full"}
                                                _hover={{
                                                    bgGradient: "linear(to-r, red.400,pink.400)",
                                                    boxShadow: "xl",
                                                }}
                                                bgGradient="linear(to-r, red.400,pink.400)"
                                                color={"white"}
                                            >
                                                Submitting
                                            </Button>
                                        ) : (
                                            <Button
                                                type={"submit"}
                                                fontFamily={"heading"}
                                                mt={8}
                                                w={"full"}
                                                _hover={{
                                                    bgGradient: "linear(to-r, red.400,pink.400)",
                                                    boxShadow: "xl",
                                                }}
                                                bgGradient="linear(to-r, red.400,pink.400)"
                                                color={"white"}
                                            >
                                                Submit
                                            </Button>
                                        )}

                                        <Stack
                                            justify={"center"}
                                            mt={2}
                                            direction={["column", "row"]}
                                        >
                                            <Link href={"/login"}>
                                                <Button
                                                    fontFamily={"heading"}
                                                    w={"full"}
                                                    bgGradient="linear(to-r, red.400,pink.400)"
                                                    color={"white"}
                                                    _hover={{
                                                        bgGradient: "linear(to-r, red.400,pink.400)",
                                                        boxShadow: "xl",
                                                    }}
                                                >
                                                    Back to Login
                                                </Button>
                                            </Link>
                                        </Stack>
                                    </Box>
                                </Box>
                            </>
                        </Container>
                    </Box>
                </form>
            </Layout>
        </>
    );
};

export default ResetPassword;
