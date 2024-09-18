import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
	return (
		<Html lang="en">
			<Head />
			<body className="min-h-screen bg-lightBackground font-figtree antialiased dark:bg-darkBackground">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;
