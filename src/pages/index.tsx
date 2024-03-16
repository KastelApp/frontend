import SEO from "@/components/seo";
import Layout from "@/components/layout";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import pack from "../../package.json";
import { useEffect, useState } from "react";
import { useIsDesktop } from "@/utils/stores.ts";
import NextLink from "next/link";

const Home = () => {
  const [hasToken, setHasToken] = useState(false);
  const { isDesktop } = useIsDesktop()

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) setHasToken(true);
    if (token === '""') setHasToken(false);
  }, []);

  return (
    <>
      <SEO
        title={"Home"}
        description={
          "Kastel is a fresh take on chat apps. With a unique look and feel, it's the perfect way to connect with friends, family, and communities."
        }
      />
      <Navbar />
      <Layout>
        <Container maxW={"3xl"}>
          <Stack
            as={Box}
            textAlign={"center"}
            align={"center"}
            spacing={{ base: 4, md: 5 }}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
              lineHeight={"110%"}
            >
              Welcome to Kastel!
            </Heading>
            <Text fontSize={"xl"}>
              You are viewing version {pack?.version || "0.0.0"}
              <br />
              On the {process.env.PUBLIC_GIT_BRANCH || "Development"} branch
              {isDesktop && (
                <>
                  <br />
                  <br />
                  You are using the desktop app! :3
                </>
              )}
            </Text>

            <NextLink href={hasToken ? "/app" : "/register"} passHref>
              <Button
                rounded={"full"}
                px={6}
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
                bgGradient="linear(to-r, red.400,pink.400)"
              >
                {hasToken ? "Open App" : "Register"}
              </Button>
            </NextLink>
          </Stack>
        </Container>
      </Layout>
    </>
  );
};

export default Home;
