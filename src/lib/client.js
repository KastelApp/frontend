import { env } from '$env/dynamic/public';
import { Client } from '@kastelll/wrapper';
import { ready } from './stores.js';

/**
 * @type {Client}
 */
let client;

function initClient(token) {
  if (typeof window === 'undefined') return null;
  if (client) return client;

  client = new Client({
    apiUrl: env.PUBLIC_API_URL,
    token: token ?? null,
    version: env.PUBLIC_API_VERSION,
    wsUrl: env.PUBLIC_API_WS_URL,
    worker: new Worker('/workers/interval.worker.js'),
    unAuthed: token ? false : true,
  });

  client.on('unReady', () => {
    setTimeout(() => {
      ready.set(false);
    }, 2500); // in case we can reconnect in 2.5 seconds, don't show the loading screen (cache will be caught up)
  });

  // you should redirect to login here
  client.on('unAuthed', () => {
    ready.set(false);
  });

  client.on('ready', () => {
    ready.set(true);
  });

  client.connect();

  return client;
}


export { initClient };