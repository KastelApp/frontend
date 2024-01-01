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
  const [error, setError] = useState<
    {
      code: string;
      message: string;
    }[]
  >([]);
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

  const login = async (
    event: FormEvent<HTMLFormElement> & {
      target: {
        email: {
          value: string;
        };
        password: {
          value: string;
        };
      };
    },
  ) => {
    event.preventDefault();
    setLoading(true);
    setError([]);

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!client.EmailRegex.test(email)) {
      setError([{ code: "INVALID_EMAIL", message: "Invalid email." }]);
      setLoading(false);

      return;
    }

    if (!client.PasswordRegex.test(password)) {
      setError([{ code: "INVALID_PASSWORD", message: "Invalid password." }]);
      setLoading(false);

      return;
    }

    const loggedInAccount = await client.loginAccount({
      email,
      password,
      resetClient: true,
    });

    if (!loggedInAccount) {
      setError([{ code: "UNKNOWN", message: "Unknown error occurred." }]);
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
      setError([
        {
          code: "INVALID_EMAIL_PASSWORD",
          message: "Invalid Email and or Password",
        },
      ]);
    } else if (loggedInAccount.errors.unknown) {
      setError([
        {
          code: "UNKNOWN",
          message: `${Object.entries(loggedInAccount.errors.unknown).map(
            ([k, obj]) => `${k} - ${obj.Message}`,
          )}`,
        },
      ]);
    } else {
      setError([{ code: "UNKNOWN", message: "Unknown error occurred." }]);
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
                  bg={useColorModeValue("gray.100", "#2D3748")}
                  rounded={"xl"}
                  p={{ base: 4, sm: 6, md: 8 }}
                  // @ts-expect-error -- (no clue what the issue is here)
                  spacing={{ base: 8 }}
                  maxW={{ lg: "lg" }}
                >
                  <Box mt={5}>
                    <Stack spacing={4}>
                      {error.length > 0 && (
                        <Text
                          mt={-3}
                          as={"span"}
                          bgGradient="linear(to-r, red.400,pink.400)"
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
                        bg={useColorModeValue("gray.200", "#1A202C")}
                        border={0}
                        color={useColorModeValue("gray.900", "gray.100")}
                        _placeholder={{
                          color: useColorModeValue("#000b2e", "#d1dcff"),
                        }}
                      />
                      <Input
                        id={"password"}
                        required={true}
                        type={"password"}
                        placeholder="CoolPassword123!"
                        bg={useColorModeValue("gray.200", "#1A202C")}
                        border={0}
                        color={useColorModeValue("gray.900", "gray.100")}
                        _placeholder={{
                          color: useColorModeValue("#000b2e", "#d1dcff"),
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
