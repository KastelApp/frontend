import { useEffect } from "react";
import { useRouter } from "next/router";
import { useReadyStore, useTokenStore } from "@/utils/stores";
import Loading from "@/components/app/loading";
import { Box } from "@chakra-ui/react";

const AtMeMessagesId = () => {
  const router = useRouter();
  const { token } = useTokenStore();
  const { ready } = useReadyStore();

  useEffect(() => {
    if (!token)
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
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

export default AtMeMessagesId;
