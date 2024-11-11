import { modalStore } from "@/wrapper/Stores/GlobalModalStore.ts";
import { useTrustedDomainStore } from "@/wrapper/Stores/TrustedDomainStore.ts";
import { Button, Checkbox } from "@nextui-org/react";
import { useRef } from "react";
import NextLink from "@/components/Link.tsx";

const Link = (props: React.JSX.IntrinsicElements["a"] & { phishingMessage?: boolean }) => {
	let href = props.href;
	const currentDomain = window.location.host;

	const kastelPathPatterns = [
		/https:\/\/kastelapp\.com\/(.+)/g,
		/https:\/\/development\.kastelapp\.com\/(.+)/g,
		// ? also get the current domain
		new RegExp(`https://${currentDomain.replace(".", "\\.")}/(.+)`, "g"),
	];

	// ? if the href matches any of those paths, we set href to be just the path so we don't need to reload the page
	for (const pattern of kastelPathPatterns) {
		const match = pattern.exec(href ?? "");
		if (match) {
			href = `/${match[1]}`;
			break;
		}
	}

	const checkboxRef = useRef<HTMLInputElement | null>(null);

	return (
		<NextLink
			href={href ?? ""}
			className="text-blue-500 hover:underline"
			target={href?.startsWith("http") ? "_blank" : ""}
			onClick={(e) => {
				if (href?.startsWith("http")) {
					const isTrusted = useTrustedDomainStore.getState().isTrusted(href);
					const isPhishingDomain = useTrustedDomainStore.getState().isPhishingDomain(href);

					if (!isTrusted || isPhishingDomain) {
						e.preventDefault();
						e.stopPropagation();

						const message = props.phishingMessage
							? "Uh oh, this message seems to be a phishing message. For your safety you may not visit this link"
							: isPhishingDomain
								? "Uh uh, this is a known phishing domain. For your safety we've prevented you from visiting this link"
								: "This link leads to a unknown third party website which we do not control. Please click the continue button below to continue.";

						modalStore.getState().createModal({
							id: `nontrusted-link-${href}`,
							title: "Do you want to trust this link?",
							closable: true,
							props: {
								modalSize: "lg",
							},
							body: (
								<div className="flex flex-col">
									<span className="text-white">{message}</span>

									<div className="mt-4 cursor-pointer break-all rounded-lg border-2 border-slate-700 bg-slate-600/25 p-2 text-white shadow-lg">
										{href}
									</div>
									<Checkbox ref={checkboxRef} className="mt-2 text-white">
										Trust this domain
									</Checkbox>
								</div>
							),
							footer: (
								<>
									<Button
										variant="flat"
										onPress={() => {
											modalStore.getState().closeModal(`nontrusted-link-${href}`);
										}}
									>
										Cancel
									</Button>
									{!isPhishingDomain && !props.phishingMessage && (
										<Button
											color="primary"
											variant="flat"
											onPress={() => {
												if (checkboxRef.current?.checked) {
													useTrustedDomainStore.getState().addTrustedDomain(href);
												}

												open(href);

												modalStore.getState().closeModal(`nontrusted-link-${href}`);
											}}
										>
											Follow
										</Button>
									)}
								</>
							),
						});
					}
				}
			}}
		>
			{props.children}
		</NextLink>
	);
};

export default Link;
