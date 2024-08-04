import NextLink from "next/link";


const Link = (props: React.JSX.IntrinsicElements["a"]) => {
	let href = props.href;
	
	const kastelPathPatterns = [
		/https:\/\/kastelapp\.com\/([\w-]+)/g,
		/https:\/\/development\.kastelapp\.com\/([\w-]+)/g,
	]

	// ? if the href matches any of those paths, we set href to be just the path so we don't need to reload the page
	for (const pattern of kastelPathPatterns) {
		const match = pattern.exec(href ?? "");
		if (match) {
			href = `/${match[1]}`;
			break;
		}
	}

	return (
		<NextLink
			href={href ?? ""}
			passHref
			className="text-blue-500 font-semibold hover:underline"
			target={href?.startsWith("http") ? "_blank" : ""}
		>
			{props.children}
		</NextLink>
	);
};

export default Link;
