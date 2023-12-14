/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");
const { fetchInfo } = require("./src/gitInfo.js");

const fetchedData = fetchInfo();

const sha = (process.env.CF_PAGES_COMMIT_SHA ?? fetchedData.gitCommitHash).slice(0, 7)

const nextConfig = {
  reactStrictMode: false,

  env: {
    PUBLIC_API_URL: process.env.PUBLIC_API_URL,
    PUBLIC_API_VERSION: process.env.PUBLIC_API_VERSION,
    PUBLIC_API_WS_URL: process.env.PUBLIC_API_WS_URL,
    PUBLIC_GIT_BRANCH: process.env.CF_PAGES_BRANCH ?? fetchedData.gitBranch,
    PUBLIC_GIT_COMMIT: sha,
  },
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  },
};

module.exports = withSentryConfig(nextConfig);
