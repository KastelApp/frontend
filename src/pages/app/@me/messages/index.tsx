import { useEffect } from "react";
import { useRouter } from "next/router";

const AtMeMessages = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/app")
  }, []);

 
};

export default AtMeMessages;
