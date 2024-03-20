import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  ...(process.env.PUBLIC_DESKTOP_APP === "false" && {
    tunnel: "/api/monitor",
  }),
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 0.4,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enabled: process.env.NODE_ENV === "production",
});
