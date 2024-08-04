import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useState } from "react";

const CustomStatus = ({
	isOpen,
	onClose,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}) => {

	const [status, setStatus] = useState("");

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">Change Your Custom Status</ModalHeader>
				<ModalBody>
					<Input
						autoFocus
						label="Whatcha up to?"
						placeholder="I'm currently..."
						variant="bordered"
						description={`Max of 128 characters - ${128 - status.length} remaining`}
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						maxLength={128}
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

export default CustomStatus;
