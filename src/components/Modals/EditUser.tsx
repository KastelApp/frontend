import { User, useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Tooltip } from "@nextui-org/react";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

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

	const { getCurrentUser } = useUserStore();

	useEffect(() => {
		setUser(getCurrentUser());

		useUserStore.subscribe((stat) => setUser(stat.getCurrentUser()));
	}, []);

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Edit User</ModalHeader>
				<ModalBody>
					<div>
						<p className="text-lg font-semibold mb-2">Personal Information</p>
						<Input
							label="Global Nickname"
							placeholder="DarkerInk"
							className="mb-4"
							variant="bordered"
							color="primary"
						/>
						<div className="flex items-center">
							<Input
								placeholder={user?.username ?? "Unknown User"}
								maxLength={32}
								radius="sm"
								className="flex-grow"
								variant="bordered"
								label="Username"
								color="primary"
								description="This is your username"
							/>
							<Input
								placeholder={user?.tag ?? "0000"}
								maxLength={4}
								type="text"
								pattern="[1-9][0-9]{3}"
								className="w-32 ml-1"
								variant="bordered"
								radius="sm"
								label="Tag"
								errorMessage="Invalid Tag"
								color="primary"
								description="This is your tag"
							/>
						</div>
						<Input
							label="Email"
							placeholder="kiki@kastelapp.com"
							className="mt-2"
							variant="bordered"
							color="primary"
							endContent={
								<Tooltip content={user?.emailVerified ? "Your email is verified" : "Your email is not verified, please check your email to verify it."}>
									{user?.emailVerified ? <Check className="text-success" size={32} /> : <X className="text-danger" size={32} />}
								</Tooltip>
							}
							isReadOnly
							value={user?.email ?? "unknown@example.com"}
							description={"Kastel staff will never ask you to change your email to one we \"own\"."}
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
						<p className="text-lg font-semibold mt-2 mb-2">Profile</p>
						<Textarea
							label="About Me"
							placeholder={"Tell us about yourself..."}
							className="mb-4"
							variant="bordered"
							color="primary"
							maxRows={3}
							defaultValue={user?.bio ?? ""}
						/>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" variant="flat" onPress={onClose}>
						Cancel
					</Button>
					<Button color="success" variant="flat" onPress={onClose}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default EditUser;
