/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />

interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly VITE_GATEWAY_URL: string;
	readonly VITE_CDN_URL: string;
	readonly VITE_MEDIA_URL: string;
	readonly VITE_WRAPPER_VERSION: string; // ? this is for the API & Gateway
	readonly VITE_IS_DESKTOP: boolean;
	readonly VITE_CLOUDFLARE_TURNSTILE_SITE_KEY: string;
	readonly VITE_GIT_BRANCH: string;
	readonly VITE_GIT_COMMIT: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
