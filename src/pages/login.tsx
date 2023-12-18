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
import NextLink from "next/link";
import Layout from "@/components/layout";
import { useRecoilState } from "recoil";
import { clientStore, tokenStore } from "@/utils/stores";
import Navbar from "@/components/navbar";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    password?: {
      message: string;
    },
    email?: {
      message: string;
    },
    terms?: {
      message: string;
    },
    username?: {
      message: string;
    },
    other?: {
      message: string;
    };
  }>(
    {}
  );
  const [client] = useRecoilState(clientStore);
  const [token, setToken] = useRecoilState(tokenStore);

  useEffect(() => {
    router.prefetch("/app");
    router.prefetch("/reset-password");
    router.prefetch("/register");

    if (token) {
      router.push("/app");
    }
  }, []);

  const login = async (event: FormEvent<HTMLFormElement> & {
    target: {
      email: {
        value: string;
      };
      password: {
        value: string;
      };
    };
  }) => {
    event.preventDefault();
    setLoading(true);
    setError({});

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!client.EmailRegex.test(email)) {
      setError({ email: { message: "Invalid email." } });
      setLoading(false);

      return;
    }

    if (!client.PasswordRegex.test(password)) {
      setError({ password: { message: "Invalid password." } });
      setLoading(false);

      return;
    }

    const loggedInAccount = await client.loginAccount({
      email,
      password,
      resetClient: true,
    });

    if (!loggedInAccount) {
      setError({ other: { message: "Unknown error occurred." } });
      setLoading(false);

      return;
    }

    if (loggedInAccount.success) {
      setToken(loggedInAccount.token);

      client.connect();
      router.push("/app");

      return;
    }

    if (loggedInAccount.errors.email || loggedInAccount.errors.password) {
      setError({ email: { message: "Invalid Email and or Password" } });
    } else if (loggedInAccount.errors.unknown) {
      setError({
        other: {
          message: `${Object.entries(loggedInAccount.errors.unknown).map(
            ([k, obj]) => `${k} - ${obj.Message}`,
          )}`,
        },
      });
    } else {
      setError({ other: { message: "Unknown error occurred." } });
    }

    setLoading(false);
  };

  return (
    <>
      <SEO title={"Login"} description={""} />
      <Navbar />
      <Layout>
        <form onSubmit={login}>
          {/* @ts-expect-error -- (no clue what the issue is here) */}
          <Box align={"center"} justify={"center"} position={"relative"}>
          {/* @ts-expect-error -- (no clue what the issue is here) */}
            <Container maxW={"7xl"} columns={{ base: 1, md: 2 }}>
              <>
                <Heading
                  lineHeight={1.1}
                  fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                >
                  Login to{" "}
                  <Text
                    as={"span"}
                    bgGradient="linear(to-r, red.400,pink.400)"
                    bgClip="text"
                  >
                    Kastel!
                  </Text>
                </Heading>

                <br />

                <Box
                  mt={5}
                  bg={useColorModeValue("gray.100", "gray.700")}
                  rounded={"xl"}
                  p={{ base: 4, sm: 6, md: 8 }}
                  // @ts-expect-error -- (no clue what the issue is here)
                  spacing={{ base: 8 }}
                  maxW={{ lg: "lg" }}
                >
                  <Box mt={5}>
                    <Stack spacing={4}>
                      {error && (
                        <Text
                          mt={-3}
                          as={"span"}
                          bgGradient="linear(to-r, red.400,pink.400)"
                          bgClip="text"
                        >
                          {Object.values(error)?.[0]?.message ||
                            "Unknown error occurred."}
                        </Text>
                      )}

                      <Input
                        id={"email"}
                        required={true}
                        type={"email"}
                        placeholder="hello@example.com"
                        bg={useColorModeValue("gray.200", "gray.600")}
                        border={0}
                        color={useColorModeValue("gray.900", "gray.100")}
                        _placeholder={{
                          color: useColorModeValue("gray.500", "gray.100"),
                        }}
                      />
                      <Input
                        id={"password"}
                        required={true}
                        type={"password"}
                        placeholder="CoolPassword123!"
                        bg={useColorModeValue("gray.200", "gray.600")}
                        border={0}
                        color={useColorModeValue("gray.900", "gray.100")}
                        _placeholder={{
                          color: useColorModeValue("gray.500", "gray.100"),
                        }}
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
                      <NextLink prefetch={false} href={"/register"}>
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
                          Create an Account
                        </Button>
                      </NextLink>

                      <NextLink prefetch={false} href={"/reset-password"}>
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
                          Forgot Password?
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
  );
};

export default Login;