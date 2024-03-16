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
import { useClientStore } from "@/utils/stores";
import Navbar from "@/components/navbar";
import t from "$/utils/typeCheck.ts";
import Link from "next/link";

const ResetPassword = () => {
    const router = useRouter();
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

    useEffect(() => {
        router.prefetch("/app");
        router.prefetch("/login");
        router.prefetch("/register");
    }, []);

    const resetPassword = async (
        event: FormEvent<HTMLFormElement> & {
            target: {
                email: {
                    value: string;
                };
            };
        },
    ) => {
        event.preventDefault();
        setLoading(true);
        setError([]);

        const email = event.target.email.value;

        if (!t(email, "email")) {
            setError([{ code: "INVALID_EMAIL", message: "Invalid email." }]);
            setLoading(false);
            return;
        }

        const resetResponse = await client.resetPassword(email);

        if (resetResponse) {
            setLoading(false);

            setError([
                {
                    code: "Success",
                    message: "An email has been sent to your email address.",
                }
            ])

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
                <form onSubmit={resetPassword} id={"reset-password"}>
                    {/* @ts-expect-error -- idk */}
                    <Box align={"center"} justify={"center"} position={"relative"}>
                        {/* @ts-expect-error -- idk */}
                        <Container maxW={"7xl"} columns={{ base: 1, md: 2 }}>
                            <>
                                <Heading
                                    lineHeight={1.1}
                                    fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                                >
                                    Reset Your Password
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
                                                id={"email"}
                                                required={true}
                                                type={"email"}
                                                placeholder="hello@example.com"
                                                bg={bg}
                                                border={0}
                                                color={color}
                                                _placeholder={{
                                                    color: hoverColor,
                                                }}
                                                autoComplete="email"
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
