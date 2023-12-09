import { useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import {
  clientStore,
  guildStore,
  readyStore,
  tokenStore,
} from "@/utils/stores";
import Loading from "@/components/app/loading";
import SEO from "@/components/seo";
import AppNavbar from "@/components/app/navbar";
import { Box } from "@chakra-ui/react";

export default function App() {
  const router = useRouter();
  const [token] = useRecoilState(tokenStore);
  const [client] = useRecoilState(clientStore);
  const [ready] = useRecoilState(readyStore);
  const [guilds] = useRecoilState(guildStore);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [ready]);

  return (
    <>
      <SEO title={"App"} />
      {ready ? (
        <>
          <Box>
            <AppNavbar
              userInfo={client?.users?.getCurrentUser()}
              guilds={guilds}
            />
          </Box>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
