import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

const CustomStatus = ({
    isOpen,
    onClose,
    onOpenChange
}: {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Change Your Custom Status</ModalHeader>
                <ModalBody>
                    <Input
                        autoFocus
                        label="Whatcha up to?"
                        placeholder="I'm currently..."
                        variant="bordered"
                        description="Max of 128 characters - 20 remaining"
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