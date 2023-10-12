import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = ({
  loaders: [
    {
      locale: 'en',
      key: 'common',
      loader: async () => (
        await import('./en.json')
      ).default,
    },
  ],
  preprocess: 'preserveArrays'
});

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);