import {
    Box,
    Button,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import {FiPlus} from "react-icons/fi";
import React from "react";

const NewServer = ({onClose, ...rest}) => {
    const modal = useDisclosure()
    return (
        <>
            <Box>
                <IconButton
                    onClick={modal.onOpen}
                    colorScheme='teal'
                    aria-label='New'
                    size='md'
                    icon={<FiPlus/>}
                />
            </Box>

            <Modal onClose={modal.onClose} isOpen={modal.isOpen} isCentered>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Create a Guild</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        Form Goes Here
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={3} onClick={modal.onClose}>Close</Button>
                        <Button>Next</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default NewServer;