import SEO from "@/components/seo";
import Layout from "@/components/layout";
import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import { useRecoilState } from "recoil";
import { tokenStore } from "@/utils/stores";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import BaseChannel from "$/Client/Structures/Channels/BaseChannel.ts";
import User from "$/Client/Structures/User.ts";
import Guild from "$/Client/Structures/Guild/Guild.ts";

interface InviteSuccess {
  channel: BaseChannel;
  code: string;
  creator: User;
  guild: Guild;
  success: true;
}

const Invite = () => {
  const router = useRouter();
  const [token] = useRecoilState(tokenStore);
  const [loading, setLoading] = useState(true);
  // const [client] = useRecoilState(clientStore);
  const [error, setError] = useState<number | null>(null);
  const [inviteInfo,] = useState<InviteSuccess | null>(null);

  useEffect(() => {
    if (!token) {
      // todo store guild invite code in local storage
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    const processInvite = async () => {
      if (router.query.code) {
        // const inviteCode = router.query.code;
        // const inviteFetch = await client.fetchInvite(inviteCode as string);

        setLoading(false);

        // if (!inviteFetch.success) {
        //   setError(1);

        //   return;
        // }

        // setInviteInfo(inviteFetch as unknown as InviteSuccess);
      }
    };

    processInvite();
  }, [router.query.code]);

  const joinGuild = async () => {
    if (!inviteInfo) {
      setError(1);

      return;
    }

    // const join = await client.joinInvite(inviteInfo.code);

    // if (!join) {
    //   setError(1);

    //   return;
    // }

    // router.push(
    //   `/app/guilds/${inviteInfo?.guild?.id}/channels/${inviteInfo?.channel?.id}}`,
    // );
  };

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
};

export default Invite;
