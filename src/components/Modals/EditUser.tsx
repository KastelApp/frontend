import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Tooltip } from "@nextui-org/react";
import { Check, LoaderCircle, X } from "lucide-react";
import { useState } from "react";
import { settings } from "@/data/constants.ts";
import { useMultiFormState } from "@/hooks/useStateForm.ts";

const EditUser = ({
	isOpen,
	onClose,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}) => {
	const currentUser = useUserStore((state) => state.getCurrentUser())!;
	const [error, setError] = useState<string | null>(null);
	const { patchUser } = useUserStore();

	const {
		globalNickname,
		username,
		tag,
		bio,
		shortBio,
		isSaving,
		save,
		clearAllErrors
	} = useMultiFormState<{
		globalNickname: string | null;
		username: string;
		tag: string;
		bio: string | null;
		shortBio: string | null;
	}>({
		globalNickname: currentUser.globalNickname,
		username: currentUser.username,
		tag: currentUser.tag,
		bio: currentUser.bio,
		shortBio: currentUser.shortBio,
		save: async (opts) => {
			console.log({ bio: opts.bio, globalNickname: opts.globalNickname, shortBio: opts.shortBio, tag: opts.tag, username: opts.username });

			const dataToUpdate = {
				bio: opts.bio === currentUser.bio ? undefined : opts.bio,
				globalNickname: opts.globalNickname === currentUser.globalNickname ? undefined : opts.globalNickname,
				shortBio: opts.shortBio === currentUser.shortBio ? undefined : opts.shortBio,
				tag: opts.tag === currentUser.tag ? undefined : opts.tag,
				username: opts.username === currentUser.username ? undefined : opts.username,
			};

			const updated = await patchUser(dataToUpdate);

			if (updated.success) {
				onClose();
				clearAllErrors();

				return;
			}

			if (updated.errors.bio) {
				bio.setError("Invalid Bio");
			}

			if (updated.errors.globalNickname) {
				globalNickname.setError("Invalid Global Nickname");
			}

			if (updated.errors.username) {
				username.setError("Invalid Username");
			}

			if (updated.errors.tag) {
				tag.setError("Invalid Tag");
			}

			if (updated.errors.unknown) {
				setError("An unknown error occurred, please try again later.");
			}
		}
	});

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
						{error && (
							<div className="mb-2 p-2 bg-danger/10 text-danger text-sm rounded-lg">
								{error}
							</div>
						)}
						<Input
							label="Global Nickname"
							placeholder={currentUser.globalNickname ?? "Global Nickname"}
							className="mb-4"
							variant="bordered"
							color="primary"
							defaultValue={currentUser.globalNickname ?? ""}
							onValueChange={globalNickname.set}
							isInvalid={!!globalNickname.error}
							errorMessage={globalNickname.error}
							maxLength={settings.maxNicknameLength}
							value={globalNickname.state ?? ""}
						/>
						<div className="flex items-center space-x-2">
							<div className="flex flex-grow">
								<Input
									placeholder={currentUser?.username ?? "Unknown User"}
									maxLength={32}
									radius="sm"
									className="flex-grow"
									variant="bordered"
									label="Username"
									color="primary"
									description="This is your username."
									value={username.state}
									onValueChange={username.set}
									isInvalid={!!username.error}
									errorMessage={username.error}
								/>
								<Input
									placeholder={currentUser?.tag ?? "0000"}
									maxLength={4}
									type="text"
									pattern="[1-9][0-9]{3}"
									className="ml-1 w-32"
									variant="bordered"
									radius="sm"
									label="Tag"
									errorMessage={tag.error}
									color="primary"
									description="This is your tag."
									value={tag.state}
									onValueChange={(e) => {
										// ? If its not a number we just ignore it
										if (!/^[0-9]*$/.test(e)) {
											console.log("Not a number");

											return;
										}


										tag.set(e);
									}}
									isInvalid={!!tag.error}
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
										currentUser?.emailVerified
											? "Your email is verified"
											: "Your email is not verified, please check your email to verify it."
									}
								>
									{currentUser?.emailVerified ? (
										<Check className="text-success" size={32} />
									) : (
										<X className="text-danger" size={32} />
									)}
								</Tooltip>
							}
							isReadOnly
							value={currentUser?.email ?? "unknown@example.com"}
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
							maxLength={settings.maxBioLength}
							value={bio.state ?? ""}
							defaultValue={currentUser.bio ?? ""}
							onValueChange={bio.set}
							isInvalid={!!bio.error}
							errorMessage={bio.error}
						/>
						<Textarea
							label="Short Bio"
							placeholder={"Short Bio..."}
							className="mb-4"
							variant="bordered"
							color="primary"
							maxRows={3}
							maxLength={settings.maxShortBioLength}
							value={shortBio.state ?? ""}
							defaultValue={currentUser.shortBio ?? ""}
							onValueChange={shortBio.set}
							isInvalid={!!shortBio.error}
							errorMessage={shortBio.error}
						/>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" variant="flat" onPress={onClose} isDisabled={isSaving}>
						Cancel
					</Button>
					<Button color="success" variant="flat" onPress={() => {
						let hasError = false;

						if (globalNickname.state && globalNickname.state.length > settings.maxNicknameLength) {
							globalNickname.setError(`Global Nickname must be less than ${settings.maxNicknameLength} characters.`);
							hasError = true;
						}

						if (username.state && (username.state.length > settings.maxNicknameLength || username.state.length < 3)) {
							if (username.state.length > settings.maxNicknameLength) username.setError(`Username must be less than ${settings.maxNicknameLength} characters.`);
							if (username.state.length < 3) username.setError("Username must be more than 3 characters.");

							hasError = true;
						}

						if (tag.state && (tag.state.length !== 4 || !/^[0-9]*$/.test(tag.state))) {
							tag.setError("Tag must be 4 numbers.");

							hasError = true;
						}

						if (bio.state && bio.state.length > settings.maxBioLength) {
							bio.setError(`Bio must be less than ${settings.maxBioLength} characters.`);

							hasError = true;
						}

						if (shortBio.state && shortBio.state.length > settings.maxShortBioLength) {
							shortBio.setError(`Short Bio must be less than ${settings.maxShortBioLength} characters.`);

							hasError = true;
						}

						if (username.state === currentUser.username && tag.state === currentUser.tag && bio.state === currentUser.bio && globalNickname.state === currentUser.globalNickname && shortBio.state === currentUser.shortBio) {
							setError("No changes were made.");

							hasError = true;
						}

						if (hasError) return;

						clearAllErrors();
						setError(null);

						save();
					}} isDisabled={isSaving}>
						{isSaving ? <LoaderCircle className="custom-animate-spin" size={24} /> : "Save"}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>)
	);
};

export default EditUser;
