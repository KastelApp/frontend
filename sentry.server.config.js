import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://a692ae7aa0fa4afba5dc70e988e8f004@sentry.kastelapp.com//3",
    tracesSampleRate: 1.0,
})