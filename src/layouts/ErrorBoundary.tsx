import Logger from "@/utils/Logger.ts";
import { Component } from "react";

class ErrorBoundary extends Component {
	public state: {
		hasError: boolean;
		error: {
			error: Error;
			errorInfo: React.ErrorInfo;
		} | null;
	};

	declare props: { children: React.ReactNode };

	public constructor(props: { children: React.ReactNode }) {
		super(props);

		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		this.setState((prev) => {
			return { ...prev, error: { error, errorInfo } };
		});
	}

	public render() {
		if (this.state.hasError) {
			Logger.error("An error occurred and we caught it", "ErrorBoundary");
			console.log(this.state.error?.error.stack);

			return (
				<div className="flex items-center justify-center bg-cover py-32 text-white">
					<div className="">
						<h1 className="text-center text-3xl font-bold">Something went wrong :/</h1>
						<p className="mt-4 text-center text-lg">Sadly we seemed to have encountered an error.</p>
						<p className="mt-2 text-center text-lg">Error: {this.state.error?.error.message}</p>
						<pre className="mt-2 whitespace-pre-wrap text-sm">{this.state.error?.error.stack}</pre>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
