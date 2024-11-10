import { Avatar, Badge, Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalHeader, Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { channelTypes, settings, snowflake } from "@/utils/Constants.ts";
import { useMultiFormState } from "@/hooks/useStateForm.ts";
import { useAPIStore } from "@/wrapper/Stores.tsx";
import { Endpoints, Routes } from "@/utils/Routes.ts";
import { CreateHubOptions } from "@/types/http/hubs/createHub.ts";
import Permissions from "@/wrapper/Permissions.ts";
import { Hub } from "@/types/payloads/ready.ts";
import { useRouter } from "next/router";
import { isErrorResponse } from "@/types/http/error.ts";
import { JoinInvitePayload } from "@/types/http/invites/joinInvite.ts";

const JoinHub = ({ setSection, onOpenChange }: { setSection: (section: "join" | "create" | "home") => void; onOpenChange: () => void }) => {
	const api = useAPIStore((state) => state.api);
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	const {
		invite,
		isSaving,
		save
	} = useMultiFormState<{ invite: string }>({
		invite: "",
		save: async ({ invite }) => {
			const hub = await api.post<unknown, JoinInvitePayload>({
				url: Endpoints.invite(invite)
			});

			if (isErrorResponse<{
				hub: {
					code: "MaxHubsReached" | "Banned" | "AlreadyIn" | "MaxMembersReached";
					message: string;
				};
				invite: {
					code: "InvalidInvite";
					message: string;
				}
			}>(hub.body)) {
				if (hub.body?.errors.hub?.code === "MaxHubsReached") {
					setError("You have reached the maximum amount of hubs");

					return;
				}

				if (hub.body?.errors.hub?.code === "Banned") {
					setError("You are banned from this hub");

					return;
				}

				if (hub.body?.errors.hub?.code === "AlreadyIn") {
					setError("You are already in this hub..?");

					return;
				}

				if (hub.body?.errors.hub?.code === "MaxMembersReached") {
					setError("This hub has reached the maximum amount of members");

					return;
				}

				if (hub.body?.errors.invite?.code === "InvalidInvite") {
					setError("Invalid invite link");

					return;
				}

				setError("An unknown error occurred");

				console.error(hub.body);

				return;
			}

			await new Promise((resolve) => setTimeout(resolve, 250));

			onOpenChange();
			router.push(Routes.hubChannels(hub.body.hub.id));
		}
	});

	return (
		<>
			<ModalHeader className="flex flex-col gap-1 text-center">
				<h1>Join a Hub</h1>
				<p className="text-sm text-gray-500">Enter an invite link to join a hub</p>
			</ModalHeader>
			<ModalBody>
				{error && (
					<div className="mb-2 p-2 bg-danger/10 text-danger text-sm rounded-lg">
						{error}
					</div>
				)}
				<Input isRequired errorMessage={invite.error} isInvalid={!!invite.error} autoFocus label="Invite Link" placeholder="https://kastelapp.com/invite/f5HgvkRbVP" variant="bordered" value={invite.state} onValueChange={invite.set} minLength={1} />
				<p className="mt-2 text-sm">Invites should look like this:</p>
				<ul className="ml-6 list-disc">
					<li className="text-sm">f5HgvkRbVP</li>
					<li className="text-sm">https://kastelapp.com/invite/f5HgvkRbVP</li>
					<li className="text-sm">https://kastelapp.com/invite/secret-place</li>
				</ul>
				<div className="mt-2 flex justify-between">
					<Button
						color="danger"
						variant="flat"
						onPress={() => setSection("home")}
						isDisabled={isSaving}
					>
						Back
					</Button>
					<Button color="success" variant="flat" isDisabled={isSaving} onPress={() => {
						if (!invite.state) {
							invite.setError("Invite link is required");

							return;
						}

						invite.clearError();
						save();
					}}>
						{isSaving ? <LoaderCircle className="custom-animate-spin" size={24} /> : "Join"}
					</Button>
				</div>
			</ModalBody>
		</>
	);
};

const HomeHub = ({ setSection }: { setSection: (section: "join" | "create" | "home") => void; }) => {
	return (
		<>
			<ModalHeader className="flex flex-col gap-1 text-center">
				<h1>Join or Create a Hub</h1>
				<p className="text-sm text-gray-500">A hub is where you can chat with friends and play games together</p>
			</ModalHeader>
			<ModalBody>
				<div className="mb-4 grid grid-cols-1 justify-start gap-2">
					<Button
						size="lg"
						color="primary"
						variant="flat"
						onPress={() => setSection("create")}
						className="mb-4 flex items-center justify-between"
					>
						<span className="text-lg">Create Hub</span>
						<ArrowRight />
					</Button>
					<Button
						size="lg"
						color="primary"
						variant="flat"
						onPress={() => setSection("join")}
						className="flex items-center justify-between"
					>
						<span className="text-lg">Join Hub</span>
						<ArrowRight />
					</Button>
				</div>
			</ModalBody>
		</>
	);
};

const CreateHub = ({ setSection, onOpenChange }: { setSection: (section: "join" | "create" | "home") => void; onOpenChange: () => void }) => {
	const isStaff = useUserStore((state) => state.isStaff(state.getCurrentUser()?.id ?? ""));
	const api = useAPIStore((state) => state.api);
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	const {
		description,
		name,
		isStaffOnly,
		save,
		isSaving
	} = useMultiFormState<{
		name: string;
		description: string | null;
		isStaffOnly: boolean,
	}>({
		name: "",
		description: null,
		isStaffOnly: false,
		save: async ({ name, description, isStaffOnly }) => {
			const mainCategory = snowflake.generate();

			const hub = await api.post<CreateHubOptions, Hub>({
				url: Endpoints.createHub(),
				data: {
					name,
					description,
					features: isStaffOnly ? [] : [], // todo: internal staff feature
					channels: [{
						name: "General",
						type: channelTypes.HubCategory,
						id: mainCategory,
						position: 0
					}, {
						name: "lounge",
						type: channelTypes.HubText,
						position: 0,
						description: "A place to chat and play games",
						parentId: mainCategory,
					}, {
						name: "clips",
						type: channelTypes.HubText,
						position: 1,
						description: "Share your favorite clips",
						parentId: mainCategory
					}],
					roles: [{
						name: "everyone",
						position: 0,
						allowedAgeRestricted: false,
						color: 0,
						everyone: true,
						permissions: new Permissions([]).add([
							"AddReactions",
							"AttachFiles",
							"CanMentionEveryone",
							"CanMentionRoles",
							"EmbedLinks",
							"MemberVoice",
							"Nickname",
							"SendMessages",
							"UseChatFormatting",
							"ViewMessageHistory",
							"UseExternalEmojis",
							"ViewChannels"
						]).normizedBits,
					}]
				}
			});

			if (
				isErrorResponse<{
					hub: {
						code: "MaxHubsReached";
						message: string;
					};
				}>(hub.body)
			) {
				if (hub.body?.errors?.hub?.code === "MaxHubsReached") {
					setError("You have reached the maximum amount of hubs");

					return;
				}

				setError("An unknown error occurred");

				console.error(hub.body);

				return;
			}

			await new Promise((resolve) => setTimeout(resolve, 250));

			onOpenChange();

			router.push(Routes.hubChannels(hub.body.id));
		}
	});

	return (
		<>
			<ModalHeader className="flex flex-col gap-1 text-center">
				<h1>Create a Hub</h1>
				<p className="text-sm text-gray-500">Create a hub to chat with friends and play games together</p>
			</ModalHeader>
			<ModalBody>
				<div className="mb-2 flex justify-center">
					<div className="flex flex-col items-center">
						<div className="transform cursor-pointer transition-all duration-300 ease-in-out active:scale-[0.98] hover:opacity-50">
							<Badge content="+" color="primary" size="lg">
								<Avatar src="/icon-1.png" size="lg" />
							</Badge>
						</div>
						<p className="mt-2 text-sm text-gray-500">Upload a hub icon</p>
					</div>
				</div>
				{error && (
					<div className="mb-2 p-2 bg-danger/10 text-danger text-sm rounded-lg">
						{error}
					</div>
				)}
				<Input errorMessage={name.error} isInvalid={!!name.error} isRequired autoFocus label="Hub Name" placeholder="My Awesome Hub" variant="bordered" maxLength={settings.maxHubNameLength} minLength={settings.minHubNameLength} value={name.state} onValueChange={name.set} />
				<Textarea errorMessage={description.error} isInvalid={!!description.error} label="Hub Description" placeholder="A place to chat and play games" variant="bordered" maxLength={settings.maxHubDescriptionLength} value={description.state || ""} onValueChange={description.set} />
				{isStaff && (
					<Checkbox size="sm" isSelected={isStaffOnly.state} onValueChange={isStaffOnly.set}>Kastel Staff Only</Checkbox>
				)}
				<div className="mt-2 flex justify-between">
					<Button
						color="danger"
						variant="flat"
						onPress={() => setSection("home")}
						isDisabled={isSaving}
					>
						Back
					</Button>
					<Button color="success" variant="flat" onPress={() => {
						let hasError = false;

						if (name.state.length < settings.minHubNameLength || name.state.length > settings.maxHubNameLength) {
							name.setError(`Hub name must be between ${settings.minHubNameLength} and ${settings.maxHubNameLength} characters`);
							hasError = true;
						} else {
							name.clearError();
						}

						if (description.state && description.state.length > settings.maxHubDescriptionLength) {
							description.setError(`Hub description must be less than ${settings.maxHubDescriptionLength} characters`);

							hasError = true;
						} else {
							description.clearError();
						}

						if (hasError) {
							return;
						}

						save();
					}} isDisabled={isSaving}>
						{isSaving ? <LoaderCircle className="custom-animate-spin" size={24} /> : "Create"}
					</Button>
				</div>
			</ModalBody>
		</>
	);
};

const HubModal = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: () => void; }) => {
	const [section, setSection] = useState<"join" | "create" | "home">("home");

	const [animationDirection, setAnimationDirection] = useState<"left" | "right">("left");

	useEffect(() => {
		if (section === "home") {
			setAnimationDirection("left");
		} else {
			setAnimationDirection("right");
		}
	}, [section]);

	const initialVariants = {
		hidden: { opacity: 0, x: animationDirection === "left" ? 100 : -100 },
		enter: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: animationDirection === "left" ? -100 : 100 },
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={() => {
				onOpenChange();
				setSection("home");
			}}
			placement="top-center"
			size="xl"
			className="w-96"
		>
			<ModalContent className="overflow-hidden">
				<motion.div
					key={section}
					initial="hidden"
					animate="enter"
					variants={initialVariants}
					transition={{ duration: 0.4 }}
				>
					{section === "home" ? (
						<HomeHub setSection={setSection} />
					) : section === "join" ? (
						<JoinHub setSection={setSection} onOpenChange={onOpenChange} />
					) : (
						<CreateHub setSection={setSection} onOpenChange={onOpenChange} />
					)}
				</motion.div>
			</ModalContent>
		</Modal>
	);
};

export default HubModal;
