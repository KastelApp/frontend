import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FaHashtag } from "react-icons/fa";
import { HiSpeakerWave } from "react-icons/hi2";
import { ReactNode, useState } from "react";

interface ChannelType {
  name: string;
  description: string;
  selected: boolean;
  icon?: ReactNode | null;
}

const initialChannelTypes: ChannelType[] = [
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
    icon: <HiSpeakerWave />,
  },
];

const CreateChannel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [channelTypes, setChannelTypes] =
    useState<ChannelType[]>(initialChannelTypes);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = (clickedType: ChannelType) => {
    const updatedChannelTypes = channelTypes.map((type) => ({
      ...type,
      selected: type.name === clickedType.name,
    }));
    setChannelTypes(updatedChannelTypes);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"sm"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Channel</ModalHeader>
        <ModalCloseButton mt={2} />

        <ModalBody>
          <form id="create-channel">
            <Text>Channel Type</Text>
            {channelTypes.map((channelType) => (
              <Flex
                key={channelType.name}
                justify="flex-start"
                align="flex-start"
                w="full"
              >
                <Button
                  borderRadius={"5px"}
                  onClick={() => handleButtonClick(channelType)}
                  mt={2}
                  w={"full"}
                  leftIcon={<>{channelType?.icon}</>}
                  justifyContent={"unset"}
                  isActive={channelType?.selected}
                >
                  <Box textAlign="left">
                    {/* Explicitly set text alignment to the left */}
                    <Text>{channelType?.name}</Text>
                    <Text fontSize="xs">{channelType?.description}</Text>
                  </Box>
                </Button>
              </Flex>
            ))}

            <FormControl isRequired mt={2}>
              <FormLabel>Channel Name</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  {channelTypes.find((type) => type.selected)?.icon}
                </InputLeftElement>
                <Input placeholder="new-channel" />
              </InputGroup>
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter display="flex">
          <Button variant={"ghost"} onClick={onClose} mr={3}>
            Cancel
          </Button>

          {loading ? (
            <Button isLoading={true}>Create Channel</Button>
          ) : (
            <Button
              onClick={() => setLoading(true)}
              form={"create-channel"}
              type={"submit"}
            >
              Create Channel
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateChannel;
