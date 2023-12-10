/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");
const currentGitBranchName = require("current-git-branch");

const nextConfig = {
  reactStrictMode: false,

  env: {
    PUBLIC_API_URL: process.env.PUBLIC_API_URL,
    PUBLIC_API_VERSION: process.env.PUBLIC_API_VERSION,
    PUBLIC_API_WS_URL: process.env.PUBLIC_API_WS_URL,
    PUBLIC_GIT_BRANCH: currentGitBranchName()
  },
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
  },
};

module.exports = withSentryConfig(nextConfig);
