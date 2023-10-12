import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const ready = writable(false);
export const token = writable(browser && ((localStorage.getItem("token") === 'null' ? null : localStorage.getItem("token"))));
/**
* @type {import('svelte/store').Writable<import('@kastelll/wrapper').BaseGuild | null>}
*/
export const currentGuild = writable(null);
/**
 * @type {import('svelte/store').Writable<import('@kastelll/wrapper').BaseChannel | null>}
 */
export const currentChannel = writable(null);

/**
 * LastChannelCache is so we can easily get the last channel a user was in for a specific guild
 * @type {import('svelte/store').Writable<import('./types/index').LastChannelCache>}
 */
export const lastChannelCache = writable(browser && (JSON.parse(localStorage.getItem("lastChannelCache") ?? "{}") ?? {}));

/**
 * CollapsedChannels is so we can easily store which categories are collapsed
 * @type {import('svelte/store').Writable<string[]>}
 */
export const collapsedChannels = writable(browser && (JSON.parse(localStorage.getItem("collapsedChannels") ?? "[]") ?? []));

/**
 * If settings are open
 */
export const settingsOpen = writable(false);

/**
 * @type {import('svelte/store').Writable<import("./types/index").Modal[]>}
 */
export const modals = writable([]);

token.subscribe((value) => {
    if (browser) localStorage.setItem("token", value);
});

lastChannelCache.subscribe((value) => {
    if (browser) localStorage.setItem("lastChannelCache", typeof value !== 'string' ? JSON.stringify(value) : value);
});

collapsedChannels.subscribe((value) => {
    if (browser) localStorage.setItem("collapsedChannels", typeof value !== 'string' ? JSON.stringify(value) : value);
});

export const key = {};