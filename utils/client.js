import {Client} from '@kastelll/wrapper';
import {channelStore, guildStore, readyStore, tokenStore} from "@/utils/stores";
import { useReadyStoreUpdater } from '../hooks/useReadyStore';

/**
 * @type {import('@kastelll/wrapper').Client}
 */
let client;

/**
 * Initializes the client
 * @param {string} token
 * @returns {import('@kastelll/wrapper').Client}
 */
export const initClient = (token) => {
    if (client) return client;

    client = new Client({
        apiUrl: process.env.PUBLIC_API_URL,
        unAuthed: !token,
        token: token ? token : null,
        version: process.env.PUBLIC_API_VERSION,
        wsUrl: process.env.PUBLIC_API_WS_URL,
        worker: new Worker('/workers/interval.worker.js')
    });

   // const [ready, setReady] = useRecoilState(tokenStore);

    client.on('unReady', () => {
        useSetRecoilState(readyStore)(false);
    });

    client.on('ready', () => {
        /*client.guilds.guildStore.subscribe((guilds) => {
            useSetRecoilState(guildStore)(guilds)
        });

        client.channels.channelStore.subscribe((channels) => {
            useSetRecoilState(channelStore)(channels)
        });*/

        setTimeout(() => useSetRecoilState(readyStore)(true), 150);
    });

    client.on('unAuthed', () => {
        useSetRecoilState(tokenStore)(null);
        client.setToken(null);

        // goto('/login');
    })

    client.connect();

    return client;
}
