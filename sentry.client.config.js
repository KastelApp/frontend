import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://61e7d2b5fc8d46d1aed3828d5bd2973c@sentry.kastelapp.com/2",
  // Replay may only be enabled for the client-side
  integrations: [new Sentry.Replay()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
