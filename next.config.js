/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  rewrites: async () => {
    // ? We are fine with users going to /app/guilds/*
    // ? but if they access just /app/guilds we want to redirect them to /app
    return [
      {
        source: "/app/guilds",
        destination: "/app",
      },
    ]
  },
}

module.exports = nextConfig
