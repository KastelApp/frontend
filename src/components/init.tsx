import { useRecoilState } from "recoil";
import {
  channelStore,
  clientStore,
  guildStore,
  isDesktop,
  readyStore,
  tokenStore,
} from "@/utils/stores";
import { useEffect } from "react";
import { Client, ClientOptions } from "@kastelll/wrapper";
import { useRouter } from "next/router";

const Init = () => {
  const [token, setToken] = useRecoilState(tokenStore);
  const [client, setClient] = useRecoilState(clientStore);
  const [, setReady] = useRecoilState(readyStore);
  const [, setGuilds] = useRecoilState(guildStore);
  const [, setChannels] = useRecoilState(channelStore);
  const [, setIsDesktop] = useRecoilState(isDesktop);
  const router = useRouter();

  useEffect(() => {
    if (client) return;

    // @ts-expect-error -- this is fine.
    if (window.__TAURI__) {
      setIsDesktop(true);
    }

    if (["/", "/404"].includes(window.location.pathname)) {
      return;
    }

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

    newClient.guilds.guilds.subscribe((guild, type) => {
      if (type === "A") {
        setGuilds((old) => [...old, guild]);
      } else if (type === "R") {
        setGuilds((old) => old.filter((g) => g.id !== guild.id));
      }
    });

    newClient.channels.channels.subscribe((channel, type) => {
      if (type === "A") {
        setChannels((old) => [...old, channel]);
      } else if (type === "R") {
        setChannels((old) => old.filter((c) => c.id !== channel.id));
      }
    });

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

  return <></>;
};

export default Init;
