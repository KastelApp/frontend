import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import SEO from "@/components/seo";
import Navbar from "@/components/navbar";
import { useIsDesktop } from "@/utils/stores.ts";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import Layout from "@/components/layout.tsx";

const OAuthAuthorize = () => {
  const desktop = useIsDesktop((s) => s.isDesktop);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!desktop) return;

    router.push("/app");
  }, [desktop]);

  const clientId = searchParams.get("client_id");
  const responseType = searchParams.get("response_type");
  const redirectUri = searchParams.get("redirect_uri");
  const scope = searchParams.get("scope");

  useEffect(() => {
    if (!router.isReady) return;
    console.log(
      "OAuth: \n " +
        clientId +
        "\n " +
        responseType +
        "\n " +
        redirectUri +
        "\n " +
        scope,
    );
  }, [router, searchParams]);

  return (
    <>
      <SEO title={"Authorize access to your account"} description={""} />
      <Navbar />
      <Layout>
        <Box>
          <Container maxW={"7xl"}>
            <Box
              bg={useColorModeValue("gray.100", "#2D3748")}
              rounded={"xl"}
              p={{ base: 4, sm: 6, md: 8 }}
              // @ts-expect-error -- (no clue what the issue is here)
              spacing={{ base: 8 }}
              maxW={{ lg: "lg" }}
            >
              <Box>
                <Stack spacing={4}>
                  <Text
                    as={"span"}
                    bgGradient="linear(to-r, red.400,pink.400)"
                    bgClip="text"
                  >
                    This page is still under development.
                  </Text>
                </Stack>
              </Box>
            </Box>
          </Container>
        </Box>
      </Layout>
    </>
  );
};

export default OAuthAuthorize;
