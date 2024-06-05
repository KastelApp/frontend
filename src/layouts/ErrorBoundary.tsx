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

			Logger.error("An error occurred and we caught it", "ErrorBoundary")
			console.log(this.state.error?.error.stack)

			return (
				<div className="bg-cover text-white py-32 flex items-center justify-center ">
					<div className="">
						<h1 className="text-center text-3xl font-bold">Something went wrong :/</h1>
						<p className="text-center text-lg mt-4">Sadly we seemed to have encountered an error.</p>
						<p className="text-center text-lg mt-2">Error: {this.state.error?.error.message}</p>
						<pre className="text-sm whitespace-pre-wrap mt-2">{this.state.error?.error.stack}</pre>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
