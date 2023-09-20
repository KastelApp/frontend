import { env } from '$env/dynamic/public';
import { Client } from '@kastelll/wrapper';
import { ready } from './stores.js';

let client;

function initClient(token) {
  if (typeof window === 'undefined') return null;

  if (client) return client;

  client = new Client({
    apiUrl: env.PUBLIC_API_URL,
    unAuthed: token ? false : true,
    token: token ? token : null,
    version: env.PUBLIC_API_VERSION,
    wsUrl: env.PUBLIC_API_WS_URL,
    worker: new Worker('/workers/interval.worker.js')
  });

  //TODO: change to unauthed when fixed
  client.on('unready', () => {
    ready.set(false);
  });

  client.on('ready', () => {
    ready.set(true);
  });

  client.connect();

  return client;
}


export { initClient };