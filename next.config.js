const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    redirects: require('./next-redirect'),
    env: {
        API_ENDPOINT: process.env.API_ENDPOINT,
        API_VERSION: process.env.API_VERSION,
        WS_ENDPOINT: process.env.WS_ENDPOINT,
        NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
    },
    sentry: {
        hideSourceMaps: true,
    }
}

module.exports = withSentryConfig(nextConfig);