import SEO from "@/components/seo";
import Layout from "@/components/layout";
import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
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
  const [error, setError] = useState(null);
  const [inviteInfo, setInviteInfo] = useState(null);

  useEffect(() => {
    if (!token) {
      // todo store guild invite code in local storage
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    async function processInvite() {
      if (router.query.code) {
        let inviteCode = router.query.code;
        let inviteFetch = await client.fetchInvite(inviteCode);
        if (inviteFetch.success) {
          if (inviteFetch.guild) {
            setInviteInfo(inviteFetch);
            setLoading(false);
            return;
          }
        }
        setLoading(false);
        setError(1); // invite invalid or expired.
      }
    }
    processInvite();
  }, [router.query.code]);

  async function joinGuild() {
    let join = await client.joinInvite(inviteInfo?.code);
    if (join) {
      setError(null);
      router.push(
        `/app/guilds/${inviteInfo?.guild?.id}/channels/${inviteInfo?.channel?.id}}`,
      );
    } else {
      setError(1);
    }
  }

  return (
    <>
      <SEO title={inviteInfo?.guild ? `${inviteInfo.guild?.name}` : "Invite"} />
      <Navbar />
      <Layout>
        <Container maxW={"3xl"}>
          {loading ? (
            <>
              <Heading as={"h1"} size={"lg"} mb={4}>
                Loading...
              </Heading>
            </>
          ) : (
            <>
              {error ? (
                <>
                  {error === 1 && (
                    <>
                      <Stack justify={"center"} align={"center"} spacing={4}>
                        <Heading as={"h1"} size={"lg"} mb={4}>
                          Invite Invalid or Expired.
                        </Heading>
                        <NextLink href={"/"} passHref>
                          <Button
                            _hover={{
                              bgGradient: "linear(to-r, red.400,pink.400)",
                              boxShadow: "xl",
                            }}
                            bgGradient="linear(to-r, red.400,pink.400)"
                          >
                            Back to Home
                          </Button>
                        </NextLink>
                      </Stack>
                    </>
                  )}
                </>
              ) : (
                <>
                  {inviteInfo?.guild && (
                    <>
                      <Stack justify={"center"} align={"center"} spacing={4}>
                        <Heading as={"h1"} size={"lg"} mb={2}>
                          {inviteInfo.guild?.name}
                        </Heading>
                        <Text>Invited by {inviteInfo.creator.username}</Text>
                        <Button
                          _hover={{
                            bgGradient: "linear(to-r, red.400,pink.400)",
                            boxShadow: "xl",
                          }}
                          bgGradient="linear(to-r, red.400,pink.400)"
                          onClick={joinGuild}
                        >
                          Join Guild
                        </Button>
                      </Stack>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}
