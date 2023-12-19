import SEO from "@/components/seo";
import Layout from "@/components/layout";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { clientStore, tokenStore } from "@/utils/stores";
import Navbar from "@/components/navbar";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
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
    router.prefetch("/login");

    if (token) {
      router.push("/app");
    }
  }, [router, token]);

  const register = async (
    event: FormEvent<HTMLFormElement> & {
      target: {
        email: {
          value: string;
        };
        password: {
          value: string;
        };
        username: {
          value: string;
        };
        confirmpassword: {
          value: string;
        };
      };
    },
  ) => {
    event.preventDefault();
    setLoading(true);
    setError([]);

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmpassword.value;

    if (password !== confirmPassword) {
      setError([
        { code: "PASSWORDS_DO_NOT_MATCH", message: "Passwords do not match." },
      ]);

      setLoading(false);
    }

    // Testing against the regexes (which should be the same that the backend uses) helps prevent unnecessary requests.
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

    if (!terms) {
      setError([
        {
          code: "TERMS_NOT_ACCEPTED",
          message: "You must accept the terms of service.",
        },
      ]);
      setLoading(false);

      return;
    }

    const registeredAccount = await client.registerAccount({
      email,
      password,
      username,
      resetClient: true,
    });

    if (!registeredAccount) {
      setError([{ code: "UNKNOWN", message: "Unknown error occurred." }]);
      setLoading(false);

      return;
    }

    if (registeredAccount.success) {
      setToken(registeredAccount.token);

      client.connect();

      router.push("/app");

      return;
    }

    if (registeredAccount.errors.email || registeredAccount.errors.password) {
      setError([
        {
          code: "INVALID_EMAIL_PASSWORD",
          message: "Invalid Email and or Password",
        },
      ]);
    } else if (registeredAccount.errors.username) {
      setError([
        {
          code: "INVALID_USERNAME",
          message: "Invalid Username (This username may be maxed out)",
        },
      ]);
    } else if (registeredAccount.errors.unknown) {
      setError([
        {
          code: "UNKNOWN",
          message: `${Object.entries(registeredAccount.errors.unknown).map(
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
      <SEO title={"Register"} description={""} />
      <Navbar />
      <Layout>
        <form onSubmit={register}>
          {/* @ts-expect-error -- (no clue what the issue is here) */}
          <Box align={"center"} justify={"center"} position={"relative"}>
            {/* @ts-expect-error -- (no clue what the issue is here) */}
            <Container maxW={"7xl"} columns={{ base: 1, md: 2 }}>
              <>
                <Heading
                  lineHeight={1.1}
                  fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                >
                  Register for{" "}
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

                      <FormControl id="username">
                        <FormLabel>Username</FormLabel>
                        <Input
                          id={"username"}
                          required={true}
                          type={"text"}
                          placeholder={"Cool User"}
                          bg={useColorModeValue("gray.200", "gray.600")}
                          border={0}
                          color={useColorModeValue("gray.900", "gray.100")}
                          _placeholder={{
                            color: useColorModeValue("gray.500", "gray.100"),
                          }}
                        />
                      </FormControl>

                      <FormControl id="email">
                        <FormLabel>Your Email</FormLabel>
                        <Input
                          id={"email"}
                          required={true}
                          type={"email"}
                          placeholder={"hello@example.com"}
                          bg={useColorModeValue("gray.200", "gray.600")}
                          border={0}
                          color={useColorModeValue("gray.900", "gray.100")}
                          _placeholder={{
                            color: useColorModeValue("gray.500", "gray.100"),
                          }}
                        />
                      </FormControl>

                      <FormControl id="password">
                        <FormLabel>Password</FormLabel>
                        <Input
                          id={"password"}
                          required={true}
                          type={"password"}
                          placeholder={"••••••••"}
                          bg={useColorModeValue("gray.200", "gray.600")}
                          border={0}
                          color={useColorModeValue("gray.900", "gray.100")}
                          _placeholder={{
                            color: useColorModeValue("gray.500", "gray.100"),
                          }}
                        />
                      </FormControl>

                      <FormControl id="confirmpassword">
                        <FormLabel>Confirm Password</FormLabel>
                        <Input
                          id={"confirmpassword"}
                          required={true}
                          type={"password"}
                          placeholder={"••••••••"}
                          bg={useColorModeValue("gray.200", "gray.600")}
                          border={0}
                          color={useColorModeValue("gray.900", "gray.100")}
                          _placeholder={{
                            color: useColorModeValue("gray.500", "gray.100"),
                          }}
                        />
                      </FormControl>

                      <Flex>
                        <Checkbox onChange={() => setTerms(!terms)}>
                          I agree to the Terms and Conditions
                        </Checkbox>
                      </Flex>
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
                      <NextLink prefetch={false} href={"/login"}>
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
                          Have an Account?
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

export default Register;