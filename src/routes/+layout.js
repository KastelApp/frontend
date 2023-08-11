import { loadTranslations } from '$lib/translations';

/** @type {import('@sveltejs/kit').Load} */

export const load = async ({ url }) => {
    const { pathname } = url;

    const locale = 'en'; //TODO: load from cookie or something

    await loadTranslations(locale, pathname); // keep this just before the `return`

    return {};
};