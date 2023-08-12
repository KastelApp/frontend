import { loadTranslations } from '$lib/translations';

/** @type {import('@sveltejs/kit').Load} */

export async function load ({ url }) {
    const { pathname } = url;

    const locale = 'en';

    await loadTranslations(locale, pathname); // keep this just before the `return`

    return {};
};