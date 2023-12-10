import SEO from "@/components/seo";
import Layout from "@/components/layout";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import pack from "../../package.json";
import generatedGitInfo from "../generatedGitInfo.json";
import NextLink from "next/link";

export default function Home() {
  return (
    <>
      <SEO title={"Home"} />
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
              On the {process.env.PUBLIC_GIT_BRANCH} branch
            </Text>

            <NextLink href={"/register"}>
              <Button
                rounded={"full"}
                px={6}
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
                bgGradient="linear(to-r, red.400,pink.400)"
              >
                Register
              </Button>
            </NextLink>
          </Stack>
        </Container>
      </Layout>
    </>
  );
}
