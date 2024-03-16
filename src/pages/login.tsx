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
  useDisclosure,
} from "@chakra-ui/react";
import Layout from "@/components/layout";
import { useClientStore, useTokenStore } from "@/utils/stores";
import Navbar from "@/components/navbar";
import t from "$/utils/typeCheck.ts";
import Robot from "@/components/Robot.tsx";
import redirectCleaner from "../utils/redirectCleaner.ts";
import Link from "next/link";

const Login = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<
    {
      code: string;
      message: string;
    }[]
  >([]);
  const { client } = useClientStore();
  const { token, setToken } = useTokenStore();
  const [resolve, setResolve] = useState<(k: string) => void>(() => () => { });

  const bg = useColorModeValue("gray.200", "#1A202C");
  const color = useColorModeValue("gray.900", "gray.100");
  const hoverColor = useColorModeValue("#000b2e", "#d1dcff");

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

    if (!t(email, "email")) {
      setError([{ code: "INVALID_EMAIL", message: "Invalid email." }]);
      setLoading(false);

      return;
    }

    if (!t(password, "string") || password.length < 4 || password.length > 72) {
      setError([{ code: "INVALID_PASSWORD", message: "Invalid password." }]);
      setLoading(false);

      return;
    }

    const attempt = async (turnstile?: string) => {
      const loggedInAccount = await client!.login({
        email,
        password,
        resetClient: true,
        turnstile,
      });

      if (loggedInAccount.success) {
        setToken(loggedInAccount.token);

        client.connect(loggedInAccount.token);

        const redirect = router.query.redirect;

        if (typeof redirect === "string") {
          router.push(redirectCleaner(redirect));

          return;
        } else {
          router.push("/app");
        }

        return;
      }

      if (loggedInAccount.errors.email || loggedInAccount.errors.password) {
        setError([
          {
            code: "INVALID_EMAIL_PASSWORD",
            message: "Invalid Email and or Password",
          },
        ]);
      } else if (Object.keys(loggedInAccount.errors.unknown).length > 0) {
        const firstError = Object.entries(loggedInAccount.errors.unknown).map(
          ([, obj]) => obj.message,
        )[0];

        setError([
          {
            code: "UNKNOWN",
            message: firstError,
          },
        ]);
      } else if (loggedInAccount.errors.captchaRequired) {
        onOpen();

        attempt(await new Promise((res) => {
          setResolve(() => res);
        }));

        return;
      } else {
        setError([{ code: "UNKNOWN", message: "Unknown error occurred." }]);
      }

      setLoading(false);
    };

    await attempt();
  };

  return (
    <>
      <SEO title={"Login"} />
      <Navbar />
      <Layout>
        <form onSubmit={login} id={"login"}>
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
                        bg={bg}
                        border={0}
                        color={color}
                        _placeholder={{
                          color: hoverColor,
                        }}
                        autoComplete="email"
                      />
                      <Input
                        id={"password"}
                        required={true}
                        type={"password"}
                        placeholder="CoolPassword123!"
                        bg={bg}
                        border={0}
                        color={color}
                        _placeholder={{
                          color: hoverColor,
                        }}
                        autoComplete="current-password"
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
                      <Link href={"/register"}>
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
                      </Link>

                      <Link href={"/reset-password"}>
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
                      </Link>
                    </Stack>

                  </Box>
                </Box>

              </>
            </Container>
          </Box>
        </form>
      </Layout>
      <Robot isOpen={isOpen} onClose={onClose} onVerify={(key) => {
        onClose();
        resolve(key);
      }} />
    </>
  );
};

export default Login;
