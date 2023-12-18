import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://82ef078c6f92edcd221a9741557060c5@sentry.theteacup.dev/4",
  ...(process.env.KASTEL_DESKTOP_APP === "false" && {
    tunnel: "/api/monitor",
  }),
  tracesSampleRate: 0.8,
});
