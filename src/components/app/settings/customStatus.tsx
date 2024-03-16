import { Box, Button, Flex, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import {
    CloseIcon
} from "@chakra-ui/icons";
import { useUserStore } from "$/utils/Stores.ts";

const CustomStatus = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const { getCurrentUser } = useUserStore();
    const [value, setValue] = useState(getCurrentUser()?.customStatus ?? "");

    const maxLength = 128;
    const remainingChars = maxLength - value.length;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Set a custom status</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text mb={2}>Custom Status</Text>
                    <Flex direction="column" alignItems="flex-end">
                        <InputGroup>
                            <Input
                                placeholder={`Whats happening today ${getCurrentUser()?.username}?`}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                maxLength={maxLength}
                                border={0}
                                _focus={{ boxShadow: "none" }}
                                bg={useColorModeValue("gray.200", "gray.800")}
                                color={useColorModeValue("gray.900", "gray.100")}
                                _placeholder={{
                                    color: useColorModeValue("gray.400", "gray.400"),
                                }}
                            />
                            <InputRightElement>
                                <Button onClick={() => setValue("")} bg={"transparent"} p={0} >
                                    <CloseIcon w={3} h={3} />
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <Box mt={2}>
                            <Text fontSize="sm" color="gray.500">
                                {remainingChars} characters left
                            </Text>
                        </Box>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button mr={3}>
                        Save
                    </Button>
                    <Button mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};


export default CustomStatus;