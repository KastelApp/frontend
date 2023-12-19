import * as Sentry from "@sentry/nextjs";
import Error from "next/error";

const CustomErrorComponent = (props: { statusCode: number }) => {
  return <Error statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: unknown) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  // @ts-expect-error -- This is fine due to the fact they don't export ContextOrProps
  await Sentry.captureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  // @ts-expect-error -- This is fine due to the fact they don't export ContextOrProps
  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
