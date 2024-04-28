import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

const ConfirmLeave = ({
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
            className="text-white"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Are you sure you want to leave?</ModalHeader>
                <ModalBody>
                    <h1 className="text-lg">You will lose access to this server (i.e messages, channels etc) unless you are invited back.</h1>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" variant="flat" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        Leave
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    );
};

export default ConfirmLeave;