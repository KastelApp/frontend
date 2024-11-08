import gitInfo from "./src/gitinfo.mjs";

const fetchedData = gitInfo();

const sha = (process.env.CF_PAGES_COMMIT_SHA ?? fetchedData.gitCommitHash).slice(0, 7);

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	productionBrowserSourceMaps: true, // ? NOTE: this is temporary. At a later point in time this will be staff only (i.e the source maps being available)
	redirects: async () => {
		// ? There's a few spots we want to redirect, depending on the environment
		// ? For example, if we are in production we want to redirect /playground to /404 since its a dev only route
		// ? same with /temp

		/**
		 * @type {import('next').Redirect[]}
		 */
		const redirects = [];

		if (process.env.NODE_ENV === "production") {
			redirects.push({
				source: "/playground/:slug*",
				destination: "/404",
				permanent: true,
			});
		}

		return redirects;
	},
	eslint: {
		ignoreDuringBuilds: true, // todo: remove since this is temp
	},
	env: {
		API_URL: process.env.PUBLIC_API_URL,
		API_WS_URL: process.env.PUBLIC_API_WS_URL,
		API_VERSION: process.env.PUBLIC_API_VERSION,
		KASTEL_DESKTOP_APP: process.env.PUBLIC_KASTEL_DESKTOP_APP,
		CLOUDFLARE_TURNSTILE_SITE_KEY: process.env.PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
		ICON_CDN: process.env.PUBLIC_ICON_CDN,
		GIT_BRANCH: process.env.CF_PAGES_BRANCH ?? fetchedData.gitBranch,
		GIT_COMMIT_SHA: sha,
	},
	typescript: {
		ignoreBuildErrors: true,
	}
};

export default nextConfig