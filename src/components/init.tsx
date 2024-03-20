import {
  useCantConnectStore,
  useClientStore,
  useIsDesktop,
  useReadyStore,
  useTokenStore,
} from "@/utils/stores";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import AppNavbar from "./app/bottomNavbar.tsx";
import pack from "../../package.json";
import { useColorMode, useDisclosure, useToast } from "@chakra-ui/react";
import { useSettingsStore, useTypingStore } from "@/wrapper/utils/Stores.ts";
import Client from "$/Client/Client.ts";
import LeftAppNavbar from "./app/leftNavbar.tsx";
import { status } from "$/types/ws.ts";
import Settings from "./app/settings/index.tsx";
import CustomStatus from "./app/settings/customStatus.tsx";

const Init = () => {
  const toast = useToast();
  const { token, setToken } = useTokenStore();
  const { client, setClient } = useClientStore();
  const { ready, setReady } = useReadyStore();
  const setIsDesktop = useIsDesktop((state) => state.setIsDesktop);
  const router = useRouter();
  const { toggleColorMode } = useColorMode();
  const { settings } = useSettingsStore();
  const setCantConnect = useCantConnectStore((state) => state.setCantConnect);
  const { typing, removeTyping } = useTypingStore();
  const [interval, setTypingInterval] = useState<NodeJS.Timeout>();
  const typingRef = useRef(typing);
  const [clientStatus, setClientStatus] = useState<status>("Disconnected");
  const clientStatusRef = useRef(clientStatus);
  const [timoutInterval, setTimeoutInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const tokenRef = useRef(token);

  useEffect(() => {
    typingRef.current = typing;
    tokenRef.current = token;
  }, [typing, token]);

  useEffect(() => {
    clientStatusRef.current = clientStatus;

    if (clientStatus !== client?.ws?.status) {
      setClientStatus(client?.ws?.status);

      return;
    }

    if (clientStatus === "Ready") {
      clearTimeout(timoutInterval!);
      setTimeoutInterval(null);
    }

    if (clientStatus === "UnRecoverable") {
      setCantConnect(true);

      toast.close("unReady");

      toast({
        title: "Connection lost and could not recover",
        description:
          "We have lost connection to the server and could not recover, please try refreshing the page.",
        variant: "subtle",
        status: "error",
        position: "top-right",
        isClosable: false,
        duration: null,
      });
    }

    if (
      clientStatus === "Disconnected" ||
      (clientStatus === "Reconnecting" && !timoutInterval)
    ) {
      setTimeoutInterval(
        setTimeout(() => {
          if (clientStatusRef.current === "Ready") return;
          if (!tokenRef.current) return;

          setReady(false);

          toast.close("unReady");

          toast({
            title: "Connection lost",
            description:
              "We have lost connection to the server, trying to reconnect...",
            variant: "subtle",
            status: "warning",
            position: "top-right",
            isClosable: false,
            duration: null,
            id: "unReady",
          });
        }, 5000),
      );
    }
  }, [clientStatus]);

  useEffect(() => {
    if (interval) clearInterval(interval);

    setTypingInterval(
      setInterval(() => {
        for (const [channelId, users] of Object.entries(typingRef.current)) {
          for (const user of users) {
            if (Date.now() - user.since > 8000) {
              removeTyping(channelId, user.userId);
            }
          }
        }
      }, 1000),
    );
  }, []);

  const whitelistedPaths: (string | RegExp)[] = [
    // ! we want to whitelist /app/* as well as /login and /register just so we can use the client in those spaces
    /^\/app?\/.*/,
    /^\/reset?\/.*/,
    "/login",
    "/register",
    "/reset-password",
    "/app",
  ];

  useEffect(() => {
    if (client) return;

    // @ts-expect-error -- this is fine.
    if (window.__TAURI__) {
      setIsDesktop(true);
    }

    // ? We make sure the path we are at is whitelisted, so we don't create a client when the user is viewing lets say /tos
    if (
      !whitelistedPaths.some(
        (path) =>
          path === router.pathname ||
          (path instanceof RegExp && path.test(router.pathname)),
      )
    ) {
      return;
    }

    const newClient = new Client({
      worker: new Worker("/workers/interval.worker.js"),
      apiUrl: process.env.PUBLIC_API_URL as string,
      version: process.env.PUBLIC_API_VERSION as string,
      wsUrl: process.env.PUBLIC_API_WS_URL as string,
      unAuthed: token ? false : true,
      restOptions: {
        cdnUrl: process.env.PUBLIC_MEDIA_CDN_URL as string,
        mediaUrl: process.env.PUBLIC_MEDIA_URL as string,
        url: process.env.PUBLIC_API_URL as string,
        defaultHeaders: {
          "X-Special-Properties": Buffer.from(
            JSON.stringify({
              version: pack.version,
              commit: process.env.PUBLIC_GIT_COMMIT as string,
              branch: process.env.PUBLIC_GIT_BRANCH as string,
              paltform:
                process.env.PUBLIC_DESKTOP_APP === "true"
                  ? "desktop"
                  : "browser",
            }),
          ).toString("base64"),
        },
      },
    });

    newClient.on("ready", () => {
      setTimeout(() => setReady(true), 150);

      toast.close("unReady");
    });

    newClient.on("unAuthed", () => {
      setToken("");
      setReady(false);
      // @ts-expect-error just setting it as null, the only place where this is allowed.
      setClient(null);

      newClient.logout();

      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    });

    newClient.on("statusUpdate", (status) => {
      setClientStatus(status);
    });

    if (token) {
      newClient.connect(token);
    }

    setClient(newClient);
  }, [token, router.pathname]);

  useEffect(() => {
    const mode = localStorage.getItem("chakra-ui-color-mode");

    if (mode !== settings.theme) {
      toggleColorMode();
    }
  }, [settings.theme]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCustomStatusOpen,
    onOpen: onCustomStatusOpen,
    onClose: onCustomStatusClose,
  } = useDisclosure();

  return (
    <>
      {router.pathname.startsWith("/app") && ready && (
        <>
          <Settings isOpen={isOpen} onClose={onClose} />
          <CustomStatus
            isOpen={isCustomStatusOpen}
            onClose={onCustomStatusClose}
          />
          {settings.navBarLocation === "bottom" ? (
            <AppNavbar
              onOpen={onOpen}
              onCustomStatusOpen={onCustomStatusOpen}
            />
          ) : (
            <LeftAppNavbar
              onOpen={onOpen}
              onCustomStatusOpen={onCustomStatusOpen}
            />
          )}
        </>
      )}
    </>
  );
};

export default Init;
