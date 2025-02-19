import Link from "@/components/Link.tsx";
import HomeLayout from "@/layouts/HomeLayout.tsx";
import { modalStore } from "@/wrapper/Stores/GlobalModalStore.ts";
import { Avatar, Button } from "@nextui-org/react";

const SecurityPage = () => {
	const topReporters = [{ username: "darkerink", avatar: "https://h1avatar.darkerink.workers.dev/proxy/darkerink" }];

	return (
		<HomeLayout>
			<div className="min-h-screen py-12">
				<div className="container mx-auto max-w-4xl rounded-lg bg-darkAccent p-4">
					<h1 className="mb-8 mt-4 text-center text-4xl font-bold">Security Vulnerability Reporting</h1>
					<p className="mb-8 text-center text-lg">
						Have you discovered a radioactive creepy-crawly in our code? We want to know about it! We take security
						seriously and appreciate your help in keeping our users safe, we got a simple list of program rules and out
						of scope vulnerabilities to help you get started.
					</p>

					<div className="bg-card mb-8 rounded-lg p-8">
						<section className="mb-8">
							<h2 className="mb-4 text-center text-2xl font-semibold">Program Rules</h2>
							<ul className="list-disc items-center justify-center space-y-2 pl-5 align-middle">
								<li>All vulnerabilities must be reported within 24 hours of discovery</li>
								<li>Do not attempt to exploit vulnerabilities beyond proof of concept</li>
								<li>Respect the privacy of our users and do not access or modify user data</li>
								<li>Please keep testing limited to accounts and hubs you own or have permission to test on</li>
							</ul>
						</section>

						<section className="mb-8">
							<h2 className="mb-4 text-center text-2xl font-semibold">Out of Scope</h2>
							<ul className="list-disc space-y-2 pl-5">
								<li>Vulnerabilities in applications or services not owned by our organization</li>
								<li>Social engineering attacks, including phishing</li>
								<li>Physical security vulnerabilities</li>
								<li>Denial of Service (DoS) attacks</li>
							</ul>
						</section>

						<section className="bg-muted rounded-lg bg-charcoal-700 p-6 text-center shadow-lg">
							<p className="mb-4 text-lg">If you want to report a vulnerability, please click the button below:</p>
							<Button
								size="lg"
								color="primary"
								variant="flat"
								className="w-full sm:w-auto"
								onPress={() => {
									modalStore.getState().createModal({
										id: "report-vulnerability",
										closable: false,
										allowCloseByButton: true,
										body: (
											<>
												<iframe
													style={{
														height: "750px",
													}}
													className="w-full"
													src="https://hackerone.com/62ceb35d-8a5e-433a-bcab-53aa4124014f/embedded_submissions/new"
													frameBorder="0"
													title="Submit Vulnerability Report"
												/>
											</>
										),
										props: {
											modalSize: "5xl",
										},
										title: "Report a Vulnerability",
									});
								}}
							>
								Report a Vulnerability
							</Button>
						</section>
					</div>

					<section className="bg-card rounded-lg p-8">
						<h2 className="mb-4 text-center text-2xl font-semibold">Special Thanks</h2>
						<p className="mb-4 text-center">To our top {topReporters.length} reporters:</p>
						<div className="flex flex-wrap items-center justify-center gap-2">
							{topReporters.map((reporter, index) => (
								<Link
									href={`https://hackerone.com/${reporter.username}?type=user`}
									key={index}
									className="flex items-center justify-center rounded-lg bg-charcoal-600 px-4 py-1 align-middle transition-colors hover:bg-charcoal-500"
								>
									<Avatar src={reporter.avatar} size="sm" />
									<p className="ml-2 text-center">{reporter.username}</p>
								</Link>
							))}
						</div>
					</section>
				</div>
			</div>
		</HomeLayout>
	);
};

export default SecurityPage;
