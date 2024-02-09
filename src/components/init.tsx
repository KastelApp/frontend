import { useRecoilState } from "recoil";
import {
  clientStore,
  isDesktop,
  readyStore,
  tokenStore,
} from "@/utils/stores";
import { useEffect } from "react";
import { Client, ClientOptions } from "@kastelll/wrapper";
import { useRouter } from "next/router";
import AppNavbar from "./app/navbar.tsx";
import pack from "../../package.json";
import { useColorMode } from "@chakra-ui/react";
import { settingsStore } from "@/wrapper/utils/Stores.ts";

const Init = () => {
  const [token, setToken] = useRecoilState(tokenStore);
  const [client, setClient] = useRecoilState(clientStore);
  const [ready, setReady] = useRecoilState(readyStore);
  const [, setIsDesktop] = useRecoilState(isDesktop);
  const router = useRouter();
  const { toggleColorMode } = useColorMode();
  const [settings] = useRecoilState(settingsStore);


  useEffect(() => {
    const stats = {
      version: pack.version,
      commit: process.env.PUBLIC_GIT_COMMIT as string,
      branch: process.env.PUBLIC_GIT_BRANCH as string,
      paltform: process.env.PUBLIC_DESKTOP_APP === "true" ? "desktop" : "browser"
    };
    const string = JSON.stringify(stats);
    console.log(Buffer.from(string).toString("base64"));
  }, []);

  useEffect(() => {
    if (client) return;

    // @ts-expect-error -- this is fine.
    if (window.__TAURI__) {
      setIsDesktop(true);
    }

    if (["/", "/404"].includes(window.location.pathname)) {
      return;
    }

    return;

    const newClient = new Client({
      worker: new Worker("/workers/interval.worker.js"),
      apiUrl: process.env.PUBLIC_API_URL as string,
      version: process.env.PUBLIC_API_VERSION as string,
      cdnUrl: process.env.PUBLIC_MEDIA_CDN_URL as string,
      mediaUrl: process.env.PUBLIC_MEDIA_URL as string,
      wsUrl: process.env.PUBLIC_API_WS_URL as string,
      token: token ? token : null,
      unAuthed: token ? false : true,
    } as ClientOptions);

    newClient.on("unReady", () => {
      setReady(false);
    });

    newClient.on("ready", () => {
      setTimeout(() => setReady(true), 150);
    });

    newClient.on("unAuthed", () => {
      setToken("");
      setReady(false);
      // @ts-expect-error just setting it as null, the only place where this is allowed.
      setClient(null);

      newClient.logout();

      router.push("/login");
    });

    newClient.connect();

    setClient(newClient);
  }, [token]);

  useEffect(() => {
    const mode = localStorage.getItem("chakra-ui-color-mode");

    if (mode !== settings.theme) {
      toggleColorMode();
    }
  }, [settings.theme]);

  return (
    <>
      {router.pathname.startsWith("/app") && ready && (
        <>
          <AppNavbar />
        </>
      )}
    </>
  );
};

export default Init;
