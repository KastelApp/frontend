import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import Tooltip from "../Tooltip.tsx";

const EditUser = ({
	isOpen,
	onClose,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}) => {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [globalNickname, setGlobalNickname] = useState<string>("");
	const [username, setUsername] = useState<string>("");
	const [tag, setTag] = useState<string>("");
	// const [email, setEmail] = useState<string>("");
	// const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [bio, setBio] = useState<string>("");

	const [bioError, setBioError] = useState<string | null>(null);
	const [globalNicknameError, setGlobalNicknameError] = useState<string | null>(null);
	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [tagError, setTagError] = useState<string | null>(null);

	const [error, setError] = useState<string | null>(null);

	const { getCurrentUser, patchUser } = useUserStore();

	useEffect(() => {
		const gotUser = getCurrentUser();

		if (!gotUser) {
			throw new Error("User not found");
		}

		setUser(gotUser);

		setBio(gotUser.bio ?? "");
		setGlobalNickname(gotUser.globalNickname ?? "");

		useUserStore.subscribe((stat) => setUser(stat.getCurrentUser()!));
	}, []);

	const save = async () => {
		const correctedBio = bio || null;
		const correctedGlobalNickname = globalNickname || null;

		const globalNicknameUpdate = correctedGlobalNickname === user?.globalNickname ? undefined : correctedGlobalNickname;
		const usernameUpdate = username ? (username === user?.username ? null : username) : null;
		const tagUpdate = tag ? (tag === user?.tag ? null : tag) : null;
		const bioUpdate = correctedBio === user?.bio ? undefined : correctedBio;

		if (tagUpdate && (tagUpdate.length !== 4 || !/^[0-9]*$/.test(tagUpdate))) {
			setTagError("Tag must be 4 numbers.");

			return;
		}

		if (globalNicknameUpdate && (globalNicknameUpdate.length > 32 || globalNicknameUpdate.length < 1)) {
			setGlobalNicknameError("Global Nickname must be less than 32 characters and more than 1 character.");

			return;
		}

		if (usernameUpdate && (usernameUpdate.length > 32 || usernameUpdate.length < 3)) {
			// ? done in two parts instead
			if (usernameUpdate.length > 32) setUsernameError("Username must be less than 32 characters.");
			if (usernameUpdate.length < 3) setUsernameError("Username must be more than 3 characters.");

			return;
		}

		if (bioUpdate && bioUpdate.length > 300) {
			setBioError("Bio must be less than 300 characters.");

			return;
		}

		if (!usernameUpdate && !tagUpdate && bioUpdate === undefined && globalNicknameUpdate === undefined) {
			setError("No changes were made.");

			return;
		}

		const updated = await patchUser({
			globalNickname: globalNicknameUpdate,
			username: usernameUpdate ?? undefined,
			tag: tagUpdate ?? undefined,
			bio: bioUpdate,
		});

		if (updated.success) {
			onClose();

			// ? remove all errors for the next time
			setBioError(null);
			setGlobalNicknameError(null);
			setUsernameError(null);
			setTagError(null);
			setError(null);

			return;
		}

		if (updated.errors.bio) {
			setBioError("Invalid Bio");
		}

		if (updated.errors.globalNickname) {
			setGlobalNicknameError("Invalid Global Nickname");
		}

		if (updated.errors.username) {
			setUsernameError("Invalid Username");
		}

		if (updated.errors.tag) {
			setTagError("Invalid Tag");
		}

		if (
			updated.errors.globalNickname &&
			updated.errors.username &&
			updated.errors.tag &&
			updated.errors.bio &&
			Object.values(updated.errors.unknown).length < 1
		) {
			setError("An unknown error occurred, please try again later.");
		}

		setError(Object.values(updated.errors.unknown)[0].message);
	};

	return (
        (<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			placement="top-center"
			isDismissable={false}
			isKeyboardDismissDisabled
			hideCloseButton
		>
            <ModalContent>
				<ModalHeader className="flex flex-col gap-1">Edit User</ModalHeader>
				<ModalBody>
					<div>
						<p className="mb-2 text-lg font-semibold">Personal Information</p>
						{error && <p className="text-center text-danger">{error}</p>}
						<Input
							label="Global Nickname"
							placeholder={user?.globalNickname ?? "Global Nickname"}
							className="mb-4"
							variant="bordered"
							color="primary"
							defaultValue={globalNickname || (user?.globalNickname ?? "")} // ? only so they can delete it if they wish
							onChange={(e) => setGlobalNickname(e.target.value)}
							isInvalid={!!globalNicknameError}
							errorMessage={globalNicknameError}
							maxLength={32}
						/>
						<div className="flex items-center space-x-2">
							<div className="flex flex-grow">
								<Input
									placeholder={user?.username ?? "Unknown User"}
									maxLength={32}
									radius="sm"
									className="flex-grow"
									variant="bordered"
									label="Username"
									color="primary"
									description="This is your username."
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									isInvalid={!!usernameError}
									errorMessage={usernameError}
								/>
								<Input
									placeholder={user?.tag ?? "0000"}
									maxLength={4}
									type="text"
									pattern="[1-9][0-9]{3}"
									className="ml-1 w-32"
									variant="bordered"
									radius="sm"
									label="Tag"
									errorMessage={tagError}
									color="primary"
									description="This is your tag."
									value={tag}
									onChange={(e) => {
										// ? If its not a number we just ignore it
										if (!/^[0-9]*$/.test(e.target.value)) return;

										setTag(e.target.value);
									}}
									isInvalid={!!tagError}
								/>
							</div>
						</div>
						<Input
							label="Email"
							placeholder="kiki@kastelapp.com"
							className="mt-2"
							variant="bordered"
							color="primary"
							endContent={
								<Tooltip
									content={
										user?.emailVerified
											? "Your email is verified"
											: "Your email is not verified, please check your email to verify it."
									}
								>
									{user?.emailVerified ? (
										<Check className="text-success" size={32} />
									) : (
										<X className="text-danger" size={32} />
									)}
								</Tooltip>
							}
							isReadOnly
							value={user?.email ?? "unknown@example.com"}
							description={'Kastel staff will never ask you to change your email to one we "own".'}
						/>
						<Input
							label="Phone Number"
							placeholder="(123) 456-7890"
							className="mt-2"
							variant="bordered"
							color="primary"
							isDisabled
							startContent={<p>+1</p>}
							endContent={<X className="text-danger" size={32} />}
						/>
					</div>
					<div>
						<p className="mb-2 mt-2 text-lg font-semibold">Profile</p>
						<Textarea
							label="About Me"
							placeholder={"Tell us about yourself..."}
							className="mb-4"
							variant="bordered"
							color="primary"
							maxRows={3}
							defaultValue={bio || (user?.bio ?? "")}
							onChange={(e) => setBio(e.target.value)}
							maxLength={300}
							isInvalid={!!bioError}
							errorMessage={bioError}
						/>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" variant="flat" onPress={onClose}>
						Cancel
					</Button>
					<Button color="success" variant="flat" onPress={save}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
        </Modal>)
    );
};

export default EditUser;
