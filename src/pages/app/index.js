import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import {initClient} from "@/utils/client";
import { useRecoilState } from "recoil";
import { clientStore, readyStore, tokenStore } from "@/utils/stores";

export default function App() {
  const { t, i18n } = useTranslation("app");
  const router = useRouter();
  const [token, setToken] = useRecoilState(tokenStore);
  const [client, setClient] = useRecoilState(clientStore);
  const [ready] = useRecoilState(readyStore)
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) {
      return router.push("/login");
    }

    setUser(client?.users?.getCurrentUser())
  }, [ready]);

  return <>{t("welcome", { name: user?.username })}</>;
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["app"])),
  },
});
