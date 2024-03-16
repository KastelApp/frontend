import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { useClientStore } from "@/utils/stores";
import JoinServer from "./joinGuild.tsx";
import constants from "$/utils/constants.ts";
import Permissions from "$/Client/Structures/BitFields/Permissions.ts";
// import { useRouter } from "next/router";

const NewGuild = () => {
  const modal = useDisclosure();
  const [form, setForm] = useState(0);

  const handleClose = () => {
    setForm(0);
    modal.onClose();
  };

  return (
    <>
      <Box>
        <IconButton
          onClick={modal.onOpen}
          colorScheme="blue"
          aria-label="New"
          boxSize="40px"
          borderRadius="full"
          icon={<FiPlus />}
        />
      </Box>

      <Modal onClose={handleClose} isOpen={modal.isOpen} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          {form === 0 && (
            <>
              <center>
                <ModalHeader>Create a Guild</ModalHeader>
              </center>
              <ModalCloseButton />

              <center>
                <Button onClick={() => setForm(1)} width="300px">
                  Create my own!
                </Button>
              </center>

              <ModalFooter
                mt={5}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <VStack>
                  <Text>Have a invite already?</Text>
                  <Button onClick={() => setForm(2)} width="300px">
                    Join a Guild
                  </Button>
                </VStack>
              </ModalFooter>
            </>
          )}

          {form === 1 && <NewServerForm modal={modal} setForm={setForm} />}

          {form === 2 && <JoinServer modal={modal} setForm={setForm} />}
        </ModalContent>
      </Modal>
    </>
  );
};

const NewServerForm = ({
  modal,
  setForm,
}: {
  modal: {
    onClose: () => void;
  };
  setForm: Dispatch<SetStateAction<number>>;
}) => {
  const client = useClientStore((s) => s.client);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<
    {
      code: string;
      message: string;
    }[]
  >([]);
  // const router = useRouter();

  const submit = async (
    event: FormEvent<HTMLFormElement> & {
      target: {
        name: {
          value: string;
        };
      };
    },
  ) => {
    if (!event.target) return;

    event.preventDefault();

    setLoading(true);

    const name = event.target.name.value;

    if (!name) {
      setLoading(false);
      setError([
        {
          code: "MISSING_NAME",
          message: "Please enter a name for your guild.",
        },
      ]);

      return;
    }

    const categoryId = client.snowflake.generate();

    const guild = await client.createGuild({
      name,
      features: [],
      channels: [
        {
          name: "General",
          type: constants.channelTypes.GuildCategory,
          id: categoryId,
        },
        {
          name: "lounge",
          type: constants.channelTypes.GuildText,
          parentId: categoryId,
        }
      ],
      roles: [
        {
          name: "everyone",
          position: 0,
          everyone: true,
          permissions: new Permissions([]).add([
            "ChangeNickname",
            "CreateInvite",
            "ViewMessageHistory",
            "ViewChannels",
            "UseExternalEmojis",
            "UseChatFormatting",
            "SendMessages",
            "Nickname",
            "EmbedLinks"
          ]).normizedBits
        }
      ]
    });

    console.log(guild);

    // if (!guild.success) {
    //   setLoading(false);

    //   setError([
    //     {
    //       code: "TBA",
    //       message: "An error occurred, check logs.",
    //     },
    //   ]);

    //   return;
    // }

    // const firstChannel = guild.guild.channels.find(
    //   (channel) => channel.type === "GuildText",
    // );

    // if (firstChannel) {
    //   router.push(`/app/guilds/${guild.guild.id}/channels/${firstChannel.id}`);
    // }

    setLoading(false);

    modal.onClose();
  };

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <center>
        <ModalHeader>Create a Guild</ModalHeader>
      </center>
      <ModalCloseButton />
      <ModalBody>
        <form id="new-note" onSubmit={submit}>
          <Stack spacing={4}>
            {error && (
              <center>
                <Text
                  bgGradient="linear(to-r, red.400,pink.400)"
                  bgClip="text"
                  fontSize={{ base: "sm", sm: "md" }}
                >
                  {error.map((err) => {
                    return err.message;
                  })}
                </Text>
              </center>
            )}

            <center>
              <FormControl>
                <Center>
                  <Flex alignItems="center">
                    <Box position="relative" display="inline-block">
                      <Avatar
                        size="xl"
                        src={selectedImage}
                        name="avatar-preview"
                        mb={4}
                        cursor="pointer"
                        onClick={() => {
                          const input = fileInputRef.current;
                          if (input) {
                            input.click();
                          }
                        }}
                      />
                      <Input
                        type="file"
                        id="avatar-input"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        position="absolute"
                        top="0"
                        left="0"
                        opacity="0"
                        width="100%"
                        height="100%"
                        cursor="pointer"
                        zIndex="-1"
                      />
                    </Box>
                  </Flex>
                </Center>

                <FormHelperText>
                  Icon upload is not functional at this time.
                </FormHelperText>
              </FormControl>
            </center>

            <FormControl isRequired>
              <FormLabel>Guild Name</FormLabel>
              <Input
                id={"name"}
                required={true}
                type={"text"}
                bg={useColorModeValue("gray.200", "gray.600")}
                placeholder="Cool Server"
                border={0}
                color={useColorModeValue("gray.900", "gray.100")}
                _placeholder={{
                  color: useColorModeValue("gray.500", "gray.100"),
                }}
              />
            </FormControl>
          </Stack>
        </form>
      </ModalBody>

      <ModalFooter
        mt={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button mr={3} onClick={() => setForm(0)}>
          Back
        </Button>

        {loading ? (
          <Button isLoading={true}>Create</Button>
        ) : (
          <Button form="new-note" type={"submit"}>
            Create
          </Button>
        )}
      </ModalFooter>
    </>
  );
};

export default NewGuild;
