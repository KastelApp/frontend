import Link from "@/components/Link.tsx";

const Footer = () => {
	const year = new Date().getFullYear();

	return (
		<footer className="bg-lightAccent dark:bg-darkAccent">
			<div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
				<div className="md:flex md:justify-between">
					<div className="mb-6 md:mb-0 md:text-left">
						<h1 className="text-2xl font-bold text-white">Kastel</h1>
						<p className="text-gray-400">Join hundreds of users today!</p>
					</div>
					<div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
						<div>
							<h2 className="mb-2 text-sm font-semibold uppercase text-white">Contact</h2>
							<ul className="font-medium text-gray-400">
								<li className="mb-1">
									<Link
										href="https://support.kastelapp.com/"
										className="hover:text-blue-500 hover:underline"
										isDisabled
									>
										Support
									</Link>
								</li>
								<li>
									<Link href="/report" className="hover:text-blue-500 hover:underline" isDisabled>
										Reporting
									</Link>
								</li>
								<li>
									<Link href="/security" className="hover:text-blue-500 hover:underline">
										Report a Vulnerability
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h2 className="mb-2 text-sm font-semibold uppercase text-white">Engage with Us</h2>
							<ul className="font-medium text-gray-400">
								<li className="mb-1">
									<Link
										href="https://github.com/orgs/KastelApp/discussions"
										className="hover:text-blue-500 hover:underline"
										isDisabled
									>
										Blog
									</Link>
								</li>
								<li className="mb-1">
									<Link
										href="https://kastelapp.com/invite/plaza"
										className="hover:text-blue-500 hover:underline"
										isDisabled
									>
										Kastel Plaza
									</Link>
								</li>
								<li className="mb-1">
									<Link
										href="https://kastelapp.com/invite/developers"
										className="hover:text-blue-500 hover:underline"
										isDisabled
									>
										Kastel Developers
									</Link>
								</li>
								<li className="mb-1">
									<Link href="/acknowledgements" className="hover:text-blue-500 hover:underline" isDisabled>
										Acknowledgements
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h2 className="mb-2 text-sm font-semibold uppercase text-white">Developers</h2>
							<ul className="font-medium text-gray-400">
								<li className="mb-1">
									<Link
										href="https://github.com/KastelApp"
										target="_blank"
										className="hover:text-blue-500 hover:underline"
									>
										GitHub
									</Link>
								</li>
								<li className="mb-1">
									<Link href="https://kastel.dev/docs" target="_blank" className="hover:text-blue-500 hover:underline">
										Documentation
									</Link>
								</li>
								<li className="mb-1">
									<Link href="https://kastel.dev/" target="_blank" className="hover:text-blue-500 hover:underline">
										Bots
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h2 className="mb-2 text-sm font-semibold uppercase text-white">Legal</h2>
							<ul className="font-medium text-gray-400">
								<li className="mb-1">
									<Link href="/privacy" className="hover:text-blue-500 hover:underline">
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link href="/terms" className="hover:text-blue-500 hover:underline">
										Terms &amp; Conditions
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<hr className="my-6 border-gray-700 sm:mx-auto lg:my-8" />
				<div className="sm:flex sm:items-center sm:justify-between">
					<span className="text-sm text-gray-400 sm:text-center">
						© {year}{" "}
						<Link href="https://kastelapp.com" className="hover:text-blue-500 hover:underline">
							Kastel
						</Link>
						. All Rights Reserved.
					</span>
					<div className="mt-4 flex sm:mt-0 sm:justify-center">
						<Link href="https://x.com/KastelApp" target="_blank" className="text-gray-500 hover:ms-5 hover:text-white">
							<svg
								className="h-4 w-4"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 17"
							>
								<path
									fillRule="evenodd"
									d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="sr-only">X (Twitter) Page</span>
						</Link>
						<Link
							href="https://github.com/KastelApp"
							target="_blank"
							className="text-gray-500 hover:ms-5 hover:text-white"
						>
							<svg
								className="h-4 w-4"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
									clipRule="evenodd"
								/>
							</svg>
							<span className="sr-only">GitHub Account</span>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
