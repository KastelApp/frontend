import AllBadges from "@/badges/AllBadges.tsx";
import Message from "@/components/Message/Message.tsx";
import EditUser from "@/components/Modals/EditUser.tsx";
import SaveChanges from "@/components/SaveChanges.tsx";
import Tooltip from "@/components/Tooltip.tsx";
import Constants from "@/utils/Constants.ts";
import { modalStore } from "@/wrapper/Stores/GlobalModalStore.ts";
import { MessageStates } from "@/wrapper/Stores/MessageStore.ts";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Avatar, Badge, Button, Card, CardBody, Divider, useDisclosure } from "@nextui-org/react";
import { Pencil, TriangleAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import mime from "mime";

const OverView = () => {
	const { getCurrentUser, getUser, getAvatarUrl, patchUser } = useUserStore();
	const user = getCurrentUser();

	const [avatarUrl, setAvatarUrl] = useState<string | null>(getAvatarUrl(user!.id, user!.avatar));
	const [differentAvatar, setDifferentAvatar] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		useUserStore.subscribe((stat) => {
			const newGotUser = stat.getCurrentUser();

			setAvatarUrl(getAvatarUrl(newGotUser!.id, newGotUser!.avatar));
		});
	}, []);

	const ref = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			if (file.size > 1024 * 1024 * 8) {
				modalStore.getState().createModal({
					title: "File too large",
					id: "avatar-too-large",
					body: (
						<div className="flex flex-col">
							<p className="text-md">The file you uploaded is too large. Please upload a file under 8MB.</p>

							<Button
								color="primary"
								className="mt-4"
								onClick={() => {
									modalStore.getState().closeModal("avatar-too-large");
								}}>
								Okay
							</Button>
						</div>
					),
					closable: true,
				});

				return;
			}

			const type = mime.getType(file.name);

			if (!type?.startsWith("image")) {
				modalStore.getState().createModal({
					title: "Invalid file type",
					id: "avatar-invalid-type",
					body: (
						<div className="flex flex-col">
							<p className="text-md">The file you uploaded is not an image. Please upload an image.</p>

							<Button
								color="primary"
								className="mt-4"
								onClick={() => {
									modalStore.getState().closeModal("avatar-invalid-type");
								}}>
								Okay
							</Button>
						</div>
					),
					closable: true,
				});

				return;
			}

			const reader = new FileReader();

			reader.onload = () => {
				setAvatarUrl(reader.result as string);
			};

			reader.readAsDataURL(file);

			setDifferentAvatar(true);
		}
	};

	const { isOpen, onClose, onOpenChange } = useDisclosure();

	if (!user) return null;

	return (
		<div>
			<EditUser isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange} />
			<Card className="rounded-lg p-0 w-full min-w-full bg-lightAccent dark:bg-darkAccent">
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
											setAvatarUrl(null);
											setDifferentAvatar(true);
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
									className="max-h-8 min-h-8 min-w-28 max-w-28 rounded-md "
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
									<Pencil size={24} className="cursor-pointer " />
								</Button>
							</div>
						</div>
						<Divider className="mt-2" />
						{!user.emailVerified && (
							<div className="w-full bg-warning/25 border-1 border-warning rounded-md">
								<div className="flex">
									<div className="p-2 flex">
										<TriangleAlert className="text-warning" size={24} />
										<p className="text-warning text-sm mt-0.5 ml-2">Your email is not verified, please check your email to verify it.</p>
									</div>
									<Button color="primary" variant="flat" className="ml-auto text-sm h-6 mt-2 w-32 mr-2 rounded-md " radius="none">
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
											<p className="text-md">{user?.globalNickname || "N/A"}</p>
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
											<p className="text-md whitespace-pre-line overflow-hidden break-words">{user?.bio || "N/A"}</p>
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
					<p className="text-lg font-semibold mb-2 text-color-base">Account Status</p>
					<ul className="list-disc ml-6 mb-2 text-color-base">
						<li>Disable Account: Temporarily locks your account. Contact support to unlock.</li>
						<li>
							Delete account: Removes all Personally Identifiable Information from our servers excluding messages, You
							can choose to delete messages as well.
						</li>
					</ul>
					<p className="text-color-base">
						Please note that deleting your account may take 14–30 days to complete. If you opt to delete your messages,
						it may take longer. Once finished, here's how your messages will be displayed:
					</p>
					<Card>
						<CardBody className="bg-lightAccent dark:bg-darkAccent select-none mt-4">
							<p className="mb-2 mt-2 text-lg">Before:</p>
							<div className="flex items-center bg-charcoal-700 rounded-lg">
								<div className="mt-2 w-full">
									<Message
										message={{
											content: "I'm a super cool person!",
											authorId: getCurrentUser()!.id,
											state: MessageStates.Sent,
											mentions: {
												channels: [],
												roles: [],
												users: []
											},
											creationDate: new Date(),
											allowedMentions: 0,
											attachments: [],
											channelId: "",
											deletable: false,
											editedDate: null,
											embeds: [],
											flags: 0,
											id: "",
											invites: [],
											pinned: false,
											nonce: null,
											replyingTo: null,
											discordInvites: [],
											author: {
												user: getCurrentUser()!,
												member: null,
												roleColor: null
											}
										}}
										highlighted={false}
										inGuild={false}
										mentionsUser={false}
										replyMessage={null}
										disableButtons
									/>
								</div>
							</div>
							<p className="mb-2 mt-2 text-lg">After:</p>
							<div className="flex items-center bg-charcoal-700 rounded-lg">
								<div className="mt-2 w-full">
									<Message message={{
										content: "[Removed by Account Deletion]",
										authorId: Constants.fakeUserIds.ghost,
										state: MessageStates.Sent,
										mentions: {
											channels: [],
											roles: [],
											users: []
										},
										creationDate: new Date(),
										allowedMentions: 0,
										attachments: [],
										channelId: "",
										deletable: false,
										editedDate: null,
										embeds: [],
										flags: 0,
										id: "",
										invites: [],
										pinned: false,
										nonce: null,
										replyingTo: null,
										discordInvites: [],
										author: {
											user: getUser(Constants.fakeUserIds.ghost)!,
											member: null,
											roleColor: null
										}
									}}
										disableButtons
										highlighted={false}
										inGuild={false}
										mentionsUser={false}
										replyMessage={null}
									/>
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
			<SaveChanges onCancel={() => {
				setDifferentAvatar(false);
				setAvatarUrl(getAvatarUrl(user.id, user.avatar));
			}} onSave={async () => {
				setLoading(true);

				const patchedUser = await patchUser({
					avatar: avatarUrl,
				});

				setLoading(false);

				if (!patchedUser.success || patchedUser.errors.avatar) {
					modalStore.getState().createModal({
						title: "Failed to upload avatar",
						id: "avatar-failed",
						body: (
							<div className="flex flex-col">
								<p className="text-md">Failed to upload your avatar. Please try again later.</p>

								<Button
									color="primary"
									className="mt-4"
									onClick={() => {
										modalStore.getState().closeModal("avatar-failed");
									}}>
									Try Again?
								</Button>
							</div>
						),
						closable: true,
					});

					return;
				}

				setDifferentAvatar(false);
			}} isShowing={differentAvatar} isLoading={loading} />
		</div>
	);
};

export default OverView;
