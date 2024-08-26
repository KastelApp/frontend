import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
	return (
		<Html lang="en">
			<Head />
			<body className="min-h-screen bg-lightBackground dark:bg-darkBackground font-sans antialiased">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
