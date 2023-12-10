import SEO from "@/components/seo";
import Layout from "@/components/layout";
import { Box, Button, Container, Heading, Stack } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import { useRecoilState } from "recoil";
import { clientStore, tokenStore } from "@/utils/stores";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

export default function Invite() {
  const router = useRouter();
  const [token] = useRecoilState(tokenStore);
  const [loading, setLoading] = useState(true);
  const [client] = useRecoilState(clientStore);
  const [guild, setGuild] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      // todo store guild invite code in local storage
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    async function processInvite() {
      if (router.query.code) {
        // todo - if valid, join guild
        let inviteCode = router.query.code;
        let inviteFetch = await client.fetchInvite(inviteCode);
        if (inviteFetch.success) {
          if (inviteFetch.guild) {
            setGuild(inviteFetch.guild);
          }
        }
        setLoading(false);
        setError(0); // invite invalid or expired.
      }
    }
    processInvite();
  }, [router.query.code]);

  return (
    <>
      <SEO title={guild ? `${guild?.name}` : "Invite"} />
      <Navbar />
      <Layout>
        <Container maxW={"3xl"}>
          <Stack
            as={Box}
            textAlign={"center"}
            align={"center"}
            spacing={{ base: 4, md: 10 }}
          >
            <Heading fontWeight={600} lineHeight={"110%"}>
              Still under construction!
            </Heading>

            <NextLink href={"/app"}>
              <Button
                rounded={"full"}
                px={6}
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
                bgGradient="linear(to-r, red.400,pink.400)"
              >
                Enter App
              </Button>
            </NextLink>
          </Stack>

          {/* temp */}
          {error ? "" : ""}
          {loading ? "" : ""}
        </Container>
      </Layout>
    </>
  );
}
