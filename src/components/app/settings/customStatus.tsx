import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { useUserStore } from "$/utils/Stores.ts";

const CustomStatus = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { getCurrentUser } = useUserStore();
  const currentUser = getCurrentUser();
  const [value, setValue] = useState(currentUser?.customStatus ?? null);

  const maxLength = 128;
  const remainingChars = maxLength - (value ? value.length : 0);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set a custom status</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" align="center">
            {msg && <Text color="red.500">{msg}</Text>}
          </Flex>
          <Text mb={2}>Custom Status</Text>
          <Flex direction="column" alignItems="flex-end">
            <InputGroup>
              <Input
                placeholder={`Whats happening today ${currentUser?.username}?`}
                value={value ?? ""}
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
                <Button onClick={() => setValue(null)} bg={"transparent"} p={0}>
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
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            mr={3}
            onClick={async () => {
              const updatedSettings = await currentUser?.updateSettings({
                customStatus: value === "" ? null : value,
              });

              if (updatedSettings?.success) {
                setMsg(null);
                onClose();
              } else {
                if (updatedSettings?.errors?.unknown) {
                  const firstError = Object.entries(
                    updatedSettings.errors.unknown,
                  ).map(([, obj]) => obj.message)[0];

                  setMsg(firstError ?? "Failed to update settings");
                } else {
                  setMsg("Failed to update settings");
                }
              }
            }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomStatus;
