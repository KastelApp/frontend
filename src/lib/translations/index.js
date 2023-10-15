import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = {
	loaders: [
		{
			locale: 'en',
			key: 'common',
			loader: async () => (await import('./en/common.json')).default
		},
		{
			locale: 'en',
			key: 'home',
			loader: async () => (await import('./en/home.json')).default,
			routes: ['/'] // you can use regexes as well!
		},
		{
			locale: 'en',
			key: 'app',
			loader: async () => (await import('./en/app.json')).default,
			routes: ['/app'] // you can use regexes as well!
		}
	],
	preprocess: 'preserveArrays'
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
