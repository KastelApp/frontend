import {
  Button,
  Flex,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { currentChannel } from "@/utils/stores.ts";
import { ChatIcon } from "@chakra-ui/icons";
// import { KeyboardEvent } from "react";
import { AutoResizeTextarea } from "@/components/AutoResizeTextarea.tsx";

const GuildMessageContainer = () => {
  const [currentChannelInfo] = useRecoilState(currentChannel);

  {
    /*
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
        event.preventDefault();
        // send message...
    }
  };
  */
  }

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
              color: useColorModeValue("gray.500", "gray.100"),
            }}
            placeholder={"Message #" + currentChannelInfo?.name || ""}
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
