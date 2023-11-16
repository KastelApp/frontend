import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import {initClient} from "@/utils/client";
import { useRecoilState } from "recoil";
import { clientStore, readyStore, tokenStore } from "@/utils/stores";
import Loading from "@/components/app/loading";

export default function App() {
  const { t } = useTranslation("app");
  const router = useRouter();
  const [token] = useRecoilState(tokenStore);
  const [client] = useRecoilState(clientStore);
  const [ready] = useRecoilState(readyStore);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return router.push("/login");
    setUser(client?.users?.getCurrentUser());
  }, [ready]);

  return (
    <>
      {ready ? (
        <>{t("welcome", { name: user?.username })}</>
      ) : (
        <Loading translations={t} />
      )}
    </>
  );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["app"])),
  },
});
