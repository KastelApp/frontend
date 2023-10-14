import { env } from '$env/dynamic/public';
import { Client } from '@kastelll/wrapper';
import { ready, guilds as guildStore, channels as channelStore } from './stores.js';
import { goto } from '$app/navigation';
import { token as tokenStore } from "./stores.js"
import { browser } from '$app/environment';
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
  if (!browser) return null;

  if (client) return client;

  client = new Client({
    apiUrl: env.PUBLIC_API_URL,
    unAuthed: token ? false : true,
    token: token ? token : null,
    version: env.PUBLIC_API_VERSION,
    wsUrl: env.PUBLIC_API_WS_URL,
    worker: new Worker('/workers/interval.worker.js')
  });

  client.on('unReady', () => {
    ready.set(false);
  });

  client.on('ready', () => {    
    client.guilds.guildStore.subscribe((guilds) => {
      guildStore.set(guilds)
    });

    client.channels.channelStore.subscribe((channels) => {
      channelStore.set(channels)
    });

    setTimeout(() => ready.set(true), 150);
  });

  client.on('unAuthed', () => {
    tokenStore.set(null);
    client.setToken(null);

    goto('/login');
  })

  client.connect();

  return client;
}