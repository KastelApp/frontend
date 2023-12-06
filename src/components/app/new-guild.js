import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  UnorderedList,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { clientStore } from "@/utils/stores";

const NewGuild = () => {
  const modal = useDisclosure();
  const [form, setForm] = useState(0);

  function handleClose() {
    modal.onClose();
  }

  return (
    <>
      <Box>
        <IconButton
          onClick={modal.onOpen}
          colorScheme="teal"
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

function NewServerForm({ modal, setForm }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [client] = useRecoilState(clientStore);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    let name = event.target.name.value;

    if (!name) {
      setLoading(false);
      setError([
        {
          code: "MISSING_NAME",
          message: "Please enter a name for your guild.",
        },
      ]);
    } else {
      // submit form

      setError(null);
      try {
        let guild = await client.guilds.createGuild({
          name: name,
          description: "",
        });
        console.log(guild);

        if (guild.success) {
          setLoading(false);
          modal.onClose();
          // redirect to guild?
          return;
        } else {
          setError([
            {
              code: "TBA",
              message: "An error occurred, check logs.",
            },
          ]);
        }

        setError([
          {
            code: "TBA",
            message: "An error occurred, check logs.",
          },
        ]);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError([
          {
            code: "UNKNOWN",
            message: "An unknown error occurred, check logs.",
          },
        ]);
      }
    }
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
}

function JoinServer({ modal, setForm }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [client] = useRecoilState(clientStore);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoading(false);
  };

  return (
    <>
      <center>
        <ModalHeader>Join a Guild</ModalHeader>
      </center>
      <ModalCloseButton />
      <ModalBody>
        <form id="join-guild" onSubmit={submit}>
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
            <FormControl isRequired>
              <FormLabel>Invite Link</FormLabel>
              <Input
                id={"invite"}
                required={true}
                type={"text"}
                bg={useColorModeValue("gray.200", "gray.600")}
                placeholder="https://kstl.app/f5HgvkRbVP"
                border={0}
                color={useColorModeValue("gray.900", "gray.100")}
                _placeholder={{
                  color: useColorModeValue("gray.500", "gray.100"),
                }}
              />
              <FormHelperText>
                Invites should look like:
                <UnorderedList>
                  <ListItem>f5HgvkRbVP</ListItem>
                  <ListItem>https://kstl.app/f5HgvkRbVP</ListItem>
                  <ListItem>https://kstl.app/secret-place</ListItem>
                </UnorderedList>
              </FormHelperText>
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
          <Button isLoading={true}>Join Guild</Button>
        ) : (
          <Button form="new-note" type={"submit"}>
            Join Guild
          </Button>
        )}
      </ModalFooter>
    </>
  );
}

export default NewGuild;
