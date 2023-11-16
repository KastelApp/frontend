import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { clientStore, tokenStore } from "@/utils/stores";

export default function Register() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState(null);
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

  const register = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    console.log(terms);

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmpassword.value;

    if (password !== confirmPassword) {
      setError({ password: { Message: "Passwords do not match." } });
      setLoading(false);
    }

    // Testing against the regexes (which should be the same that the backend uses) helps prevent unnecessary requests.
    if (!client.EmailRegex.test(email)) {
      setError({ email: { Message: "Invalid email." } });
      setLoading(false);

      return;
    }
    
    if (!client.PasswordRegex.test(password)) {
      setError({ password: { Message: "Invalid password." } });
      setLoading(false);

      return;
    }
    
    if (!terms) {
      setError({ terms: { Message: "You must accept the terms of service." } });
      setLoading(false);

      return;
    } 

    const registeredAccount = await client.registerAccount({
      email,
      password,
      username,
      resetClient: true,
    });

    if (registeredAccount.success) {
      setToken(registeredAccount.token);
      
      client.connect();

      router.push("/app");

      return;
    }

    if (registeredAccount.errors.email || registeredAccount.errors.password) {
      setError({ email: { Message: "Invalid Email and or Password" } });
    } else if (registeredAccount.errors.username) {
      setError({ username: { Message: "Invalid Username (This username may be maxed out)" } });
    } else if (registeredAccount.errors.unknown) {
      setError({ other: { Message: `${Object.entries(registeredAccount.errors.unknown).map(([k, obj]) => `${k} - ${obj.Message}`)}` } });
    } else {
      setError({ other: { Message: "Unknown error occurred." } });
    }

    setLoading(false);
  };

  return (
    <>
      <SEO title={t("register.title")} />

      <Layout>
        <form onSubmit={register}>
          <Box align={"center"} justify={"center"} position={"relative"}>
            <Container maxW={"7xl"} columns={{ base: 1, md: 2 }}>
              <>
                <Heading
                  lineHeight={1.1}
                  fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                >
                  {t("register.message")}{" "}
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
                          {Object.values(error)?.[0]?.Message ||
                            "Unknown error occurred."}
                        </Text>
                      )}

                      <FormControl id="username">
                        <FormLabel>{t("register.username")}</FormLabel>
                        <Input
                          id={"username"}
                          required={true}
                          type={"text"}
                          placeholder={"Cool.User"}
                          bg={useColorModeValue("gray.200", "gray.600")}
                          border={0}
                          color={useColorModeValue("gray.900", "gray.100")}
                          _placeholder={{
                            color: useColorModeValue("gray.500", "gray.100"),
                          }}
                        />
                      </FormControl>

                      <FormControl id="email">
                        <FormLabel>{t("register.email")}</FormLabel>
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
                        <FormLabel>{t("register.password")}</FormLabel>
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
                        <FormLabel>{t("register.confirmPassword")}</FormLabel>
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
                          {t("register.terms")}
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
                      <NextLink href={"/login"}>
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
                          {t("register.button")}
                        </Button>
                      </NextLink>

                      <NextLink href={"/reset-password"}>
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
                          {t("forgotPass")}
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
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
