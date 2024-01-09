import { useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { readyStore, tokenStore } from "@/utils/stores";
import Loading from "@/components/app/loading";
import { Box } from "@chakra-ui/react";

const AtMeMessages = () => {
  const router = useRouter();
  const [token] = useRecoilState(tokenStore);
  const [ready] = useRecoilState(readyStore);

  useEffect(() => {
    if (!token) router.push("/login");
  }, [ready]);

  return (
    <>
      {ready ? (
        <>
          <Box>Not Finished</Box>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default AtMeMessages;
