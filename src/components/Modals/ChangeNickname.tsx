import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useState } from "react";

const ChangeNickname = ({
	isOpen,
	onClose,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}) => {
	const [nickname, setNickname] = useState("");

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center" size="lg">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Change Your Nickname</ModalHeader>
				<ModalBody>
					<Input
						autoFocus
						placeholder="Kiki"
						variant="bordered"
						maxLength={32}
						className="w-full min-w-64"
						description={`Max of 32 characters - ${32 - nickname.length} remaining`}
						value={nickname}
						onChange={(e) => setNickname(e.target.value)}
					/>
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

export default ChangeNickname;
