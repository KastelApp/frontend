import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  ...(process.env.PUBLIC_DESKTOP_APP === "false" && {
    tunnel: "/api/monitor",
  }),
  tracesSampleRate: 0.8,
});
