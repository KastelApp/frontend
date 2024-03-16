import { withSentryConfig } from "@sentry/nextjs";
import fetchInfo from "./src/gitInfo.mjs";

const fetchedData = fetchInfo();

const sha = (
  process.env.CF_PAGES_COMMIT_SHA ?? fetchedData.gitCommitHash
).slice(0, 7);

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: false,
  env: {
    PUBLIC_API_URL: process.env.PUBLIC_API_URL,
    PUBLIC_API_VERSION: process.env.PUBLIC_API_VERSION,
    PUBLIC_API_WS_URL: process.env.PUBLIC_API_WS_URL,
    PUBLIC_GIT_BRANCH: process.env.CF_PAGES_BRANCH ?? fetchedData.gitBranch,
    PUBLIC_GIT_COMMIT: sha,
    PUBLIC_MEDIA_CDN_URL: process.env.PUBLIC_MEDIA_CDN_URL,
    PUBLIC_MEDIA_URL: process.env.PUBLIC_MEDIA_URL,
    NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY:
      process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
    PUBLIC_DESKTOP_APP: process.env.KASTEL_DESKTOP_APP,
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  },
  ...(process.env.KASTEL_DESKTOP_APP === "true" && {
    output: "export",
    images: {
      unoptimized: true, // ? can't have this in the desktop app (which sucks :()
    }
  }),
};

export default withSentryConfig(nextConfig);
