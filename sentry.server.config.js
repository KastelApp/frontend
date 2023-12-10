import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://098b37403533c38e0f70091e47bd0950@sentry.theteacup.dev/3",
  tunnel: "/api/monitor",
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
