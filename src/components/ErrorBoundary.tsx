import { Component } from "react";
import { Box, Heading, Text, Button, Center } from "@chakra-ui/react";

class ErrorBoundary extends Component {
  public state: { hasError: boolean; };
  public props!: { children: React.ReactNode; };
  public error: {
    error: Error;
    errorInfo: React.ErrorInfo;
  } | null = null;

  public constructor(props: { children: React.ReactNode; }) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.error = { error, errorInfo };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Center height="100vh">
          <Box>
            <Heading textAlign={"center"} as="h1" size="xl" mb={2}>Uh oh, something went wrong</Heading>
            <br />
            <Text align={"center"} fontSize="lg" mb={4}>It seems that something went wrong, we'll look into it. <br /> In the meantime, please try reloading the page.</Text>
            <Text align={"center"} fontSize="lg" mb={4}><strong>Error:</strong> {this.error?.error.message}</Text>
            <br />
            <Button
              margin={"auto"}
              display={"block"}
              size="lg"
              colorScheme="red"
              onClick={() => window.location.reload()}>Reload?</Button>
            {process.env.NODE_ENV === "development" && (
              <>
                <br />
                <Button
                  margin={"auto"}
                  display={"block"}
                  size="lg"
                  colorScheme="red"
                  onClick={() => this.setState({ hasError: false })}>Ignore?</Button>
              </>
            )}
          </Box>
        </Center>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;