import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  clientStore,
  guildStore,
  readyStore,
  tokenStore,
} from "@/utils/stores";
import { Box, Text } from "@chakra-ui/react";
import AppNavbar from "@/components/app/navbar";
import Loading from "@/components/app/loading";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SEO from "@/components/seo";

const GuildChannelPage = () => {
  const { t } = useTranslation("app");
  const router = useRouter();
  const { guildId, channelId } = router.query;
  const [token] = useRecoilState(tokenStore);
  const [client] = useRecoilState(clientStore);
  const [ready] = useRecoilState(readyStore);
  const [user, setUser] = useState(null);
  const [guilds] = useRecoilState(guildStore);
  const [guild, setGuild] = useState(null);

  useEffect(() => {
    if (!token) return router.push("/login");
    setUser(client?.users?.getCurrentUser());

    if (ready) {
      if (guildId) {
        // is user in guild?
        if (!guilds.some((guild) => guild.id === guildId)) {
          router.push("/app");
        }

        const foundGuild = client.guilds.get(guildId);
        if (!foundGuild) return router.push("/app");
        setGuild(foundGuild);
        console.log(foundGuild);

        // is channel in guild?
        /*if (!guilds.some((guild) => guild.channels.some((channel) => channel.id === channelId))) {
                     router.push("/app");
                }*/
      } else {
        router.push("/app");
      }
    }
  }, [guildId, ready]);

  return (
    <>
      <SEO title={t("title")} />
      {ready ? (
        <>
          <Box>
            <AppNavbar userInfo={user} guilds={guilds} />
            <SEO title={guild?.name || "Loading"} />
            <Text>
              Name: {guild?.name || "Loading"} <br />
              ID: {guildId} <br />
              Channel ID: {channelId}
            </Text>
          </Box>
        </>
      ) : (
        <Loading translations={t} />
      )}
    </>
  );
};

export default GuildChannelPage;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking", // Generate pages on-demand
  };
}

export const getStaticProps = async ({ params, locale }) => ({
  props: {
    params: params,
    ...(await serverSideTranslations(locale ?? "en", ["app"])),
  },
});