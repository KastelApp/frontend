import { useRecoilState } from "recoil";
import { channelStore, clientStore, guildStore, readyStore, tokenStore } from "../utils/stores.js";
import { useEffect } from "react";
import { EventEmitter } from "events";
import { Client } from "@kastelll/wrapper";

class Testing extends EventEmitter { }

const Init = () => {
    const [token, setToken] = useRecoilState(tokenStore);
    const [client, setClient] = useRecoilState(clientStore);
    const [, setReady] = useRecoilState(readyStore);
    const [, setGuilds] = useRecoilState(guildStore);
    const [, setChannels] = useRecoilState(channelStore);

    useEffect(() => {
        if (client) return;

        const newClient = new Client({
            apiUrl: process.env.PUBLIC_API_URL,
            unAuthed: !token,
            token: token ? token : null,
            version: process.env.PUBLIC_API_VERSION,
            wsUrl: process.env.PUBLIC_API_WS_URL,
            worker: new Worker("/workers/interval.worker.js"),
        });

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
            setToken(null);
            setReady(false);
            setClient(null);
            newClient.logout();
        });

        newClient.connect();

        setClient(newClient);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);


    return;
};

export default Init;

export { Testing };