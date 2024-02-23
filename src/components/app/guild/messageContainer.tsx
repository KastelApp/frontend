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
        ...old,
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
          state: "sending"
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
                // 50% chance of failing
                state: Math.random() > 0.5 ? "sent" : "failed"
              };
            }
            return message;
          });
        });
      }, 1000);


      event.currentTarget.value = "";
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
