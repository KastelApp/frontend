import AllBadges from "@/badges/AllBadges.tsx";
import Message from "@/components/Message/Message.tsx";
import EditUser from "@/components/Modals/EditUser.tsx";
import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Avatar, Badge, Button, Card, CardBody, Divider, Tooltip, useDisclosure } from "@nextui-org/react";
import { Pencil, TriangleAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const OverView = () => {
	const [user, setUser] = useState<User | null>(null);

	const { getCurrentUser } = useUserStore();

	const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar ?? null);

	useEffect(() => {
		const gotUser = getCurrentUser();

		setUser(gotUser);

		setAvatarUrl(gotUser?.avatar ?? null);

		useUserStore.subscribe((stat) => {
			const newGotUser = stat.getCurrentUser();

			setUser(newGotUser);

			setAvatarUrl(newGotUser?.avatar ?? null);
		});
	}, []);

	const ref = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setAvatarUrl(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const { isOpen, onClose, onOpenChange } = useDisclosure();

	return (
		<div>
			<EditUser isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange} />
			<Card className="rounded-lg p-0 w-full min-w-full bg-accent">
				<CardBody>
					<div>
						<div className="flex items-end justify-between p-2">
							<div className="flex items-end justify-between">
								<Tooltip content="Remove Avatar" placement="right" delay={750} className="select-none">
									<Badge
										content={<X />}
										placement="top-right"
										className="mb-2 mr-1 h-8 w-8 hover:scale-95 active:scale-85 cursor-pointer hover:opacity-95 z-50"
										color={"danger"}
										onClick={() => {
											console.log("Remove Avatar");
										}}
									>
										<div className="relative transition-opacity duration-300 ease-in-out group">
											<Avatar src={avatarUrl ?? user?.defaultAvatar} alt="User Avatar" className="h-24 w-24 bg-transparent" />
											<p className="hidden group-hover:block text-white font-bold text-xs absolute inset-0 ml-1 mt-10 w-full min-w-full items-center justify-center !z-20">
												Change Avatar
											</p>
											<input
												ref={ref}
												type="file"
												accept=".png,.jpg,.jpeg,.apng,.gif"
												className="cursor-pointer absolute inset-0 w-full h-full opacity-0 z-20"
												title=""
												onChange={handleFileChange}
											/>
											<div className="group-hover:bg-opacity-50 rounded-full absolute inset-0 bg-black bg-opacity-0" />
										</div>
									</Badge>
								</Tooltip>
								<div>
									<AllBadges privateFlags={user?.flags ?? "9"} publicFlags={user?.publicFlags ?? "0"} size={20} />
								</div>
							</div>
							<div className="flex items-start justify-start gap-1">
								<Button
									color="primary"
									variant="flat"
									className="max-h-8 min-h-8 min-w-28 max-w-28 rounded-md"
									radius="none"
								>
									View Profile
								</Button>
								<Button
									color="primary"
									variant="flat"
									className="max-h-8 min-h-8 min-w-16 max-w-16 rounded-md"
									radius="none"
									onClick={() => {
										onOpenChange();
									}}
								>
									<Pencil size={24} className="cursor-pointer text-primary" />
								</Button>
							</div>
						</div>
						<Divider className="mt-2" />
						{!user?.emailVerified && (
							<div className="w-full bg-warning/25 border-1 border-warning rounded-md">
								<div className="flex">
									<div className="p-2 flex">
										<TriangleAlert className="text-warning" size={24} />
										<p className="text-warning text-sm mt-0.5 ml-2">Your email is not verified, please check your email to verify it.</p>
									</div>
									<Button color="primary" variant="flat" className="ml-auto text-sm h-6 mt-2 w-32 mr-2 rounded-md" radius="none">
										Resend
									</Button>
								</div>
							</div>
						)}
						<div>
							<Card className="mt-2 mb-2" isBlurred>
								<CardBody className="flex flex-col overflow-y-auto max-h-[85vh]">
									<div className="flex justify-between items-center mb-4">
										<div>
											<p className="text-lg font-semibold">Global Nickname</p>
											<p className="text-md">{user?.globalNickname}</p>
										</div>
									</div>
									<div className="flex justify-between items-center mb-4">
										<div>
											<p className="text-lg font-semibold">Username</p>
											<span className="flex">
												<p className="text-md">{user?.username}</p>
												<p className="ml-0.5 text-md text-gray-400">#{user?.tag}</p>
											</span>
										</div>
									</div>
									<div className="flex justify-between items-center mb-4">
										<div>
											<p className="text-lg font-semibold">Email</p>
											<p className="text-md blur-sm hover:blur-0 transition-all duration-300">
												{user?.email}
											</p>
										</div>
									</div>
									<div className="flex justify-between items-center mb-4">
										<div>
											<p className="text-lg font-semibold">Phone Number</p>
											<p className="text-md">{user?.phoneNumber ?? "N/A"}</p>
										</div>
									</div>
									<div className="flex justify-between items-center mb-4">
										<div>
											<p className="text-lg font-semibold">About Me</p>
											<p className="text-md">{user?.bio}</p>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					</div>
				</CardBody>
			</Card>
			<Divider className="mt-6 mb-6" />
			<div className="ml-2">
				<p className="text-xl font-semibold mb-2">Account & Security</p>
				{/* 
                // todo: finish
                <div>
                    <p className="text-lg font-semibold mb-2">MFA</p>
                    <p className="text-md">Multi-factor authentication (MFA) provides an extra layer of security for your account. When enabled, you will need to provide a verification code in addition to your password during login.</p>
                </div> */}
				<div>
					<p className="text-lg font-semibold mb-2">Account Status</p>
					<ul className="list-disc ml-6 mb-2">
						<li>Disable Account: Temporarily locks your account. Contact support to unlock.</li>
						<li>
							Delete account: Removes all Personally Identifiable Information from our servers excluding messages, You
							can choose to delete messages as well.
						</li>
					</ul>
					<p>
						Please note that deleting your account may take 14–30 days to complete. If you opt to delete your messages,
						it may take longer. Once finished, here's how your messages will be displayed:
					</p>
					<Card>
						<CardBody className="bg-accent select-none mt-4">
							<p className="mb-2 mt-2 text-lg">Before:</p>
							<div className="flex items-center bg-charcoal-700 rounded-lg">
								<div className="mt-2 w-full">
									<Message content="I'm a very cool person" mention={false} replying={false} disableButtons />
								</div>
							</div>
							<p className="mb-2 mt-2 text-lg">After:</p>
							<div className="flex items-center bg-charcoal-700 rounded-lg">
								<div className="mt-2 w-full">
									<Message content="[Removed by Account Deletion]" mention={false} replying={false} disableButtons />
								</div>
							</div>
						</CardBody>
					</Card>
					<Button color="danger" className="mt-4" variant="flat">
						Delete Account
					</Button>
					<Button color="warning" className="mt-4 ml-4" variant="flat">
						Disable Account
					</Button>
				</div>
			</div>
		</div>
	);
};

export default OverView;
