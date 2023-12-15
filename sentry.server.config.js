import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://82ef078c6f92edcd221a9741557060c5@sentry.theteacup.dev/4",
  ...(process.env.KASTEL_DESKTOP_APP === "false" && {
    tunnel: "/api/monitor",
  }),  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
