import HomeLayout from "@/layouts/HomeLayout.tsx";
import { modalStore } from "@/wrapper/Stores/GlobalModalStore.ts";
import { Avatar, Button } from "@nextui-org/react";
import Link from "next/link";

const SecurityPage = () => {
    const topReporters = [
        { username: "darkerink", avatar: "https://profile-photos.hackerone-user-content.com/variants/qaj9dannoh67fk4jpiqc9t4ntb72/66555439a92cf3e7dc0339d5fb79b6624a23d8919c96c34859e2df0522f0278e" }
    ];

    return (
        <HomeLayout>
            <div className="min-h-screen py-12">
                <div className="container mx-auto p-4 max-w-4xl bg-darkAccent rounded-lg">
                    <h1 className="text-4xl font-bold mb-8 text-center mt-4">Security Vulnerability Reporting</h1>
                    <p className="text-lg text-center mb-8">
                        Have you discovered a radioactive creepy-crawly in our code? We want to know about it!
                        We take security seriously and appreciate your help in keeping our users safe, we got a simple list of program rules and out of scope vulnerabilities to help you get started.
                    </p>

                    <div className="bg-card rounded-lg p-8 mb-8">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-center">Program Rules</h2>
                            <ul className="list-disc pl-5 space-y-2 justify-center align-middle items-center">
                                <li>All vulnerabilities must be reported within 24 hours of discovery</li>
                                <li>Do not attempt to exploit vulnerabilities beyond proof of concept</li>
                                <li>Respect the privacy of our users and do not access or modify user data</li>
                                <li>Please keep testing limited to accounts and hubs you own or have permission to test on</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-center">Out of Scope</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Vulnerabilities in applications or services not owned by our organization</li>
                                <li>Social engineering attacks, including phishing</li>
                                <li>Physical security vulnerabilities</li>
                                <li>Denial of Service (DoS) attacks</li>
                            </ul>
                        </section>

                        <section className="bg-muted p-6 rounded-lg text-center bg-charcoal-700 shadow-lg">
                            <p className="text-lg mb-4">
                                If you want to report a vulnerability, please click the button below:
                            </p>
                            <Button size="lg" color="primary" variant="flat" className="w-full sm:w-auto" onClick={() => {
                                modalStore.getState().createModal({
                                    id: "report-vulnerability",
                                    closable: false,
                                    allowCloseByButton: true,
                                    body: (
                                        <>
                                            <iframe style={{
                                                height: "750px"
                                            }} className="w-full" src="https://hackerone.com/62ceb35d-8a5e-433a-bcab-53aa4124014f/embedded_submissions/new" frameBorder="0" title="Submit Vulnerability Report" />
                                        </>
                                    ),
                                    props: {
                                        modalSize: "5xl"
                                    },
                                    title: "Report a Vulnerability"
                                });
                            }}>Report a Vulnerability</Button>
                        </section>
                    </div>

                    <section className="bg-card rounded-lg p-8">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Special Thanks</h2>
                        <p className="mb-4 text-center">To our top {topReporters.length} reporters:</p>
                        <div className="flex flex-wrap justify-center items-center gap-2">
                            {topReporters.map((reporter, index) => (
                                <Link href={`https://hackerone.com/${reporter.username}?type=user`} key={index} className="flex items-center justify-center align-middle bg-charcoal-600 px-4 py-1 rounded-lg hover:bg-charcoal-500 transition-colors" >
                                    <Avatar src={reporter.avatar} size="sm" />
                                    <p className="text-center ml-2">{reporter.username}</p>
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