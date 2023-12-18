import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://82ef078c6f92edcd221a9741557060c5@sentry.theteacup.dev/4",
  ...(process.env.KASTEL_DESKTOP_APP === "false" && {
    tunnel: "/api/monitor",
  }),
  integrations: [new Sentry.Replay()],
  tracesSampleRate: 0.8,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
