import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { clientStore } from "@/utils/stores";

const NewServer = () => {
  const modal = useDisclosure();
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

  function handleClose() {
    modal.onClose();
    setError(null);
    setLoading(false);
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

      <Modal onClose={handleClose} isOpen={modal.isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a Guild</ModalHeader>
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

                <Input
                  id={"name"}
                  required={true}
                  type={"text"}
                  bg={useColorModeValue("gray.200", "gray.600")}
                  placeholder="Name"
                  border={0}
                  color={useColorModeValue("gray.900", "gray.100")}
                  _placeholder={{
                    color: useColorModeValue("gray.500", "gray.100"),
                  }}
                />
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleClose}>
              Close
            </Button>
            {loading ? (
              <Button isLoading={true}>Next</Button>
            ) : (
              <Button form="new-note" type={"submit"}>
                Next
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewServer;
