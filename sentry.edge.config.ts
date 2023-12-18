import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c67e1e61a3f708fd0be231f96646eb42@sentry.kastelapp.com/2",
  ...(process.env.KASTEL_DESKTOP_APP === "false" && {
    tunnel: "/api/monitor",
  }),
  tracesSampleRate: 0.8,
});
