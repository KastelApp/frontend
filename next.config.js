/** @type {import('next').NextConfig} */
const {i18n} = require('./next-i18next.config.js');
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
    reactStrictMode: true,
    i18n,
    env: {
        PUBLIC_API_URL: process.env.PUBLIC_API_URL,
        PUBLIC_API_VERSION: process.env.PUBLIC_API_VERSION,
        PUBLIC_API_WS_URL: process.env.PUBLIC_API_WS_URL,
    },
    sentry: {
        disableServerWebpackPlugin: true,
        disableClientWebpackPlugin: true,
    }
}

module.exports = withSentryConfig(nextConfig);
