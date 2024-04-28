import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";

// todo: show 2fa modal (lol 3 modals on top of each other)
const ConfirmDelete = ({
    isOpen,
    onClose,
    onOpenChange
}: {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
}) => {

    const [timer, setTimer] = useState(10);

    useEffect(() => {
        if (isOpen) {
            setTimer(10);

            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 0) {
                        clearInterval(interval);
    
                        return 0;
                    }
    
                    return prev - 1;
                });
            }, 1000);

            return () => {
                clearInterval(interval);
            }
        }
    }, [isOpen])

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            className="text-white"
            key={"confirm-delete-modal"}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Are you sure you want to delete your server?</ModalHeader>
                <ModalBody>
                    <p className="text-lg">If you delete your server you will loose these:</p>
                    <ul className="list-disc ml-6">
                        <li>Messages</li>
                        <li>Channels</li>
                        <li>Roles</li>
                        <li>Members</li>
                        <li>Banned Members</li>
                    </ul>

                    <p>If you are sure please {timer > 0 ? `wait ${timer} seconds more seconds` : "click delete below"}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" variant="flat" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        {timer <= 0 ? "Delete" : `Delete in ${timer} seconds`}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    );
};

export default ConfirmDelete;