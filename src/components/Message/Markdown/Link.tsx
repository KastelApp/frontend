import { useTrustedDomainStore } from "@/wrapper/Stores.ts";
import NextLink from "next/link";


const Link = (props: React.JSX.IntrinsicElements["a"]) => {
	let href = props.href;
	const currentDomain = window.location.host;

	const kastelPathPatterns = [
		/https:\/\/kastelapp\.com\/(.+)/g,
		/https:\/\/development\.kastelapp\.com\/(.+)/g,
		// ? also get the current domain
		new RegExp(`https://${currentDomain.replace(".", "\\.")}/(.+)`, "g")
	];

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
			className="text-blue-500 hover:underline"
			target={href?.startsWith("http") ? "_blank" : ""}
			onClick={() => {
				if (href?.startsWith("http")) {
					const isTrusted = useTrustedDomainStore.getState().isTrusted(href);

					if (!isTrusted) {
						// e.preventDefault();
						// e.stopPropagation();

						console.log("not trusted");
					}
				}
			}}
		>
			{props.children}
		</NextLink>
	);
};

export default Link;
