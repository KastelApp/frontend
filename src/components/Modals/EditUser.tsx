import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { Check, X } from "lucide-react";

const EditUser = ({
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
                                placeholder="Username"
                                maxLength={32}
                                radius="sm"
                                className="flex-grow "
                                variant="bordered"
                                description="The Users Username"
                                label="Username"
                                color="primary"
                            />
                            <Input
                                placeholder="Tag"
                                maxLength={4}
                                type="text"
                                pattern="[1-9][0-9]{3}"
                                className="w-32 ml-1"
                                variant="bordered"
                                radius="sm"
                                label="Tag"
                                description="The Users Tag"
                                errorMessage="Invalid Tag"
                                color="primary"
                            />
                        </div>
                        <Input
                            label="Email"
                            placeholder="kiki@kastelapp.com"
                            className="mt-2"
                            variant="bordered"
                            color="primary"
                            endContent={<Check className="text-success" size={32} />}
                            isReadOnly
                            value={"darkerink@kastelapp.com"}
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
                        <p className="text-lg font-semibold mt-2 mb-2">Misc (change name later)</p>
                        <Textarea
                            label="About Me"
                            placeholder="Testing"
                            className="mb-4"
                            variant="bordered"
                            color="primary"
                            maxRows={3}
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