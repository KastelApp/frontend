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
    ];
  },
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

      redirects.push({
        source: "/temp",
        destination: "/404",
        permanent: true,
      });
    }

    return redirects;
  },
  eslint: {
    ignoreDuringBuilds: true, // todo: remove since this is temp
  }
};

module.exports = nextConfig;
