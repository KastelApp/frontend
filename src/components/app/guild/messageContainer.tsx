import {
  Button,
  Flex,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { ChatIcon } from "@chakra-ui/icons";
// import { KeyboardEvent } from "react";
import { AutoResizeTextarea } from "@/components/AutoResizeTextarea.tsx";
import { clientStore } from "@/utils/stores.ts";
import { messageStore } from "$/utils/Stores.ts";

const GuildMessageContainer = () => {
  const [client] = useRecoilState(clientStore);
  const [, setMessage] = useRecoilState(messageStore);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      const message = event.currentTarget.value ?? "";

      if (message.trim() === "") return;

      const id = Math.random().toString(36).substring(7);

      setMessage((old) => [
        ...old.slice(-49),
        {
          content: message,
          time: `Today at ${new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
          })}`,
          user: {
            avatar: client.user.getAvatarUrl({ size: 128 }),
            discriminator: client.user.tag,
            presence: client.user.currentPresence,
            username: client.user.username,
            globalNickname: client.user.globalNickname ?? client.user.username
          },
          id,
          state: "sending",
          edited: false
        }
      ]);

      // scroll to bottom
      const chat = document.getElementById("bottom-chat");

      if (chat) {
        setTimeout(() => chat.scrollIntoView({ behavior: "instant" }), 50);
      }


      setTimeout(() => {
        setMessage((old) => {
          return old.map((message) => {
            if (message.id === id) {
              return {
                ...message,
                state: Math.random() > 0.75 ? "failed" : "sent",
                edited: Math.random() > 0.75
              };
            }
            return message;
          })
        });
      }, 1000);


      event.currentTarget.value = "";
    } else if (event.key === "b" && event.ctrlKey) {
      event.preventDefault();

      const textarea = event.currentTarget;

      const start = textarea.selectionStart;

      const end = textarea.selectionEnd;

      const selected = textarea.value.substring(start, end);

      if (start !== end) {
        textarea.value =
          textarea.value.substring(0, start) +
          `**${selected}**` +
          textarea.value.substring(end);
        textarea.setSelectionRange(start, end + 4);
      } else {
        textarea.value =
          textarea.value.substring(0, start) +
          "****" +
          textarea.value.substring(end);
        textarea.setSelectionRange(start + 3, start + 3);
      }
    }
  };

  return (
    <>
      <Flex
        w={"full"}
        alignItems="center"
        pos="fixed"
        bottom="75"
        px="3"
        maxW="calc(100% - 400px)"
        left="50%"
        transform="translateX(-50%)"
      >
        <InputGroup>
          {/*<InputLeftElement>
                <Button w={"1rem"} h={"1.75rem"}>
                    <AddIcon/>
                </Button>
            </InputLeftElement>*/}
          <AutoResizeTextarea
            data-gramm_editor="false"
            resize="none"
            bg={useColorModeValue("gray.200", "gray.800")}
            border={0}
            color={useColorModeValue("gray.900", "gray.100")}
            _placeholder={{
              color: useColorModeValue("gray.400", "gray.400"),
            }}
            placeholder={"Message #" + client.currentChannel?.name ?? ""}
            onKeyDown={handleKeyDown}
            _focus={{ boxShadow: "none" }}
          />
          <InputRightElement width="4rem">
            <Button h={"1.75rem"} w={"1.5rem"}>
              <ChatIcon />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </>
  );
};

export default GuildMessageContainer;
