import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SEO from "@/components/seo";
import Layout from "@/components/layout";
import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Home() {
  const { t } = useTranslation("common");
  return (
    <>
      <SEO title={t("home.title")} />

      <Layout>
        <Container h={{ base: "100%", lg: "100vh" }} maxW={"3xl"}>
          <Stack
            as={Box}
            textAlign={"center"}
            align={"center"}
            spacing={{ base: 8, md: 14 }}
            py={{ base: 20, md: 36 }}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
              lineHeight={"110%"}
            >
              {t("home.welcome")} Kastel! <br />
            </Heading>
            <Text color={"gray.500"}></Text>

            <Stack spacing={6} direction={"row"}>
              <NextLink prefetch={false} href="/register">
                <Button
                  rounded={"full"}
                  px={6}
                  _hover={{
                    bgGradient: "linear(to-r, red.400,pink.400)",
                    boxShadow: "xl",
                  }}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  color={"white"}
                >
                  {t("home.start")}
                </Button>
              </NextLink>
              <Button rounded={"full"} px={6}>
                {t("home.learn")}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Layout>
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
