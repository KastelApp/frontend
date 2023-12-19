import SEO from "@/components/seo";
import Layout from "@/components/layout";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import pack from "../../package.json";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isDesktop } from "@/utils/stores.ts";

const Home = () => {
  const [hasToken, setHasToken] = useState(false);
  const [desktop] = useRecoilState(isDesktop);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token !== "null") setHasToken(true);
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
            spacing={{ base: 4, md: 10 }}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
              lineHeight={"110%"}
            >
              Welcome to Kastel! <br />
            </Heading>
            <Text fontSize={"xl"} color={"gray.500"}>
              You are viewing version {pack?.version || "0.0.0"}
              <br />
              On the {process.env.PUBLIC_GIT_BRANCH || "Development"} branch
              {desktop && (
                <>
                  <br />
                  <br />
                  You are using the desktop app! :3
                </>
              )}
            </Text>

            <NextLink href={hasToken ? "/app" : "/register"}>
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
