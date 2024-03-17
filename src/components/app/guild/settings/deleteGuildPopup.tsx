import { useGuildStore } from "$/utils/Stores.ts";
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

const DeleteGuildPopup = ({
    isOpen,
    onClose,
    closeSettings
}: {
    isOpen: boolean;
    onClose: () => void;
    closeSettings: () => void;
}) => {
    const { getCurrentGuild } = useGuildStore();
    const currentGuild = getCurrentGuild();
    const [msg, setMsg] = useState<string | null>(null);
    const router = useRouter();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Are you sure?</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" align="center">
                        {msg && <Text color="red.500" mb={4}>{msg}</Text>}
                        <Text fontSize={"lg"}>
                            Are you sure you want to delete <strong>{currentGuild?.name}</strong>?
                        </Text>
                        <Text fontSize={"sm"} mt={2} textAlign="center"> 
                            This action cannot be undone, all the messages, channels and messages will be lost.
                        </Text>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button mr={3}

                        border="2px solid hsl(339, 90%, 51%, 1)"
                        color="hsl(339, 90%, 51%, 1)"
                        _hover={{
                            color: "hsl(339, 90%, 41%, 1)",
                            borderColor: "hsl(339, 90%, 41%, 1)",
                        }}
                        onClick={async () => {
                            const deleted = await currentGuild?.delete();

                            if (deleted) {
                                onClose();
                                closeSettings();
                                router.push("/app");
                            } else {
                                setMsg("Failed to delete guild");
                            }
                        }}
                    >
                        Delete Guild
                    </Button>
                    <Button mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};


export default DeleteGuildPopup;