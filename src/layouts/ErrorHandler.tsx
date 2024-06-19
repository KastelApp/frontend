import { useEffect, useState } from "react";

const ErrorHandler = ({
	children,
}: {
	children?: React.ReactElement | React.ReactElement[] | React.ReactElement | React.ReactElement[][];
}) => {
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		window.onerror = (____, _, __, ___, error) => {
			setError(error!);
		};

		window.addEventListener("unhandledrejection", (event) => {
			setError(event.reason);
		});

		return () => {
			window.onerror = null;
			window.removeEventListener("unhandledrejection", () => { });
		};
	}, []);

	useEffect(() => {
		if (error) {
			throw error;
		}
	}, [error]);

	return <>{children}</>;
};

export default ErrorHandler;
