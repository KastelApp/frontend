import { writable } from "svelte/store";
import { browser } from "$app/environment"

export const ready = writable(false);
export const token = writable(browser && (localStorage.getItem("token") ?? null));

token.subscribe((value) => {
    if (browser) localStorage.setItem("token", value);
});

export const key = {};