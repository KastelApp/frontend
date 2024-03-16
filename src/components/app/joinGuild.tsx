import { Dispatch, FormEvent, SetStateAction, useState } from "react";
// import { clientStore } from "@/utils/stores.ts";
// import { useRouter } from "next/router";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  ListItem,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  UnorderedList,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useClientStore } from "@/utils/stores.ts";

const JoinServer = ({
  modal,
  setForm,
}: {
  modal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
  };
  setForm: Dispatch<SetStateAction<number>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<
    {
      code: string;
      message: string;
    }[]
  >([]);
  const client = useClientStore((s) => s.client);
  const router = useRouter();

  const getLastParam = (link: string) => {
    const parts = link.split("/");
    const lastPart = parts[parts.length - 1];

    if (lastPart !== link) {
      return lastPart; // Return the last part if '/' is present
    } else {
      return link; // Return the input as it is (no '/' found)
    }
  };

  const submit = async (
    event: FormEvent<HTMLFormElement> & {
      target: {
        invite: {
          value: string;
        };
      };
    },
  ) => {
    event.preventDefault();

    if (!event) return;

    setLoading(true);
    setError([]);

    const inviteLink = event.target.invite.value;

    if (!inviteLink) {
      setLoading(false);
      setError([
        {
          code: "MISSING_INVITE",
          message: "Please enter a invite link.",
        },
      ]);

      return;
    }

    // const inviteCode = getLastParam(inviteLink);
    // const inviteFetch = await client.fetchInvite(inviteCode);

    // if (!inviteFetch.success) {
    //   setLoading(false);

    //   setError([
    //     {
    //       code: "INVITE",
    //       message: "The invite link is invalid or expired.",
    //     },
    //   ]);

    //   return;
    // }

    const join = await client.joinInvite(getLastParam(inviteLink) as string);

    if (!join.success) {
      setLoading(false);

      setError([
        {
          code: "INVITE",
          message:
            "The invite link is expired, invalid or you are banned from the guild.",
        },
      ]);

      return;
    }

    setLoading(false);
    setError([]);

    modal.onClose();

    router.push(
      `/app/guilds/${join.data?.guild?.id}/channels/${join.data?.channel?.id}}`,
    );
    return;
  };

  return (
    <>
      <form id="join-guild" onSubmit={submit}>
        <center>
          <ModalHeader>Join a Guild</ModalHeader>
        </center>
        <ModalCloseButton />
        <ModalBody>
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
            <Button form="join-guild" type={"submit"}>
              Join Guild
            </Button>
          )}
        </ModalFooter>
      </form>
    </>
  );
};

export default JoinServer;
