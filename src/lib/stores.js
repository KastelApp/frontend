import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const ready = writable(false);
export const token = writable(browser && (localStorage.getItem("token") ?? null));
/**
* @type {import('svelte/store').Writable<import('@kastelll/wrapper').BaseGuild | null>}
*/
export const currentGuild = writable(null);
/**
 * @type {import('svelte/store').Writable<import('@kastelll/wrapper').BaseChannel | null>}
 */
export const currentChannel = writable(null);

token.subscribe((value) => {
    if (browser) localStorage.setItem("token", value);
});

export const key = {};