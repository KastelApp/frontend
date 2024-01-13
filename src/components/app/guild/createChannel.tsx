import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FaHashtag } from "react-icons/fa";
import { HiSpeakerWave } from "react-icons/hi2";

const channelTypes = [
  {
    name: "Text",
    description: "Send messages in text channels",
    selected: true,
    icon: <FaHashtag />,
  },
  {
    name: "Voice",
    description: "Talk with your friends",
    selected: false,
    icon: <HiSpeakerWave  />,
  },
];

const CreateChannel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"sm"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Channel</ModalHeader>
        <ModalCloseButton mt={2} />

        <ModalBody>
          <Text>Channel Type</Text>
          {channelTypes.map((channelType) => (
              <Flex
                  key={channelType.name}
                  justify="flex-start"
                  align="flex-start"
                  w="full"
              >
                  <Button
                      mt={2}
                      w={"full"}
                      leftIcon={channelType?.icon}
                      justifyContent={"unset"}
                      isActive={channelType?.selected}
                  >
                      <Box textAlign="left"> {/* Explicitly set text alignment to the left */}
                          <Text>{channelType?.name}</Text>
                          <Text fontSize="xs">{channelType?.description}</Text>
                      </Box>
                  </Button>
              </Flex>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateChannel;
