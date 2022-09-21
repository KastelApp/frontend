/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    redirects: require('./next-redirect'),
    env: {
        API_ENDPOINT: process.env.API_ENDPOINT,
        API_VERSION: process.env.API_VERSION,
        WS_ENDPOINT: process.env.WS_ENDPOINT,
    }
}

module.exports = nextConfig