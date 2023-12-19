import { useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { readyStore, tokenStore } from "@/utils/stores";
import Loading from "@/components/app/loading";
import SEO from "@/components/seo";
import AppNavbar from "@/components/app/navbar";
import { Box } from "@chakra-ui/react";

const App = () => {
  const router = useRouter();
  const [token] = useRecoilState(tokenStore);
  const [ready] = useRecoilState(readyStore);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [ready]);

  return (
    <>
      <SEO
        title={"App"}
        description={
          "Kastel is a fresh take on chat apps. With a unique look and feel, it's the perfect way to connect with friends, family, and communities."
        }
      />
      {ready ? (
        <>
          <Box>
            <AppNavbar />
          </Box>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default App;
