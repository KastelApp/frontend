import {
  Button,
  Flex,
  InputGroup,
  InputRightElement,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { currentChannel } from "@/utils/stores.ts";
import { ChatIcon } from "@chakra-ui/icons";

const GuildMessage = () => {
  const [currentChannelInfo] = useRecoilState(currentChannel);

  return (
    <>
      <Flex w={"full"} alignItems="center" pos="fixed" bottom="75" px="3">
        <InputGroup>
          {/*<InputLeftElement>
                <Button w={"1rem"} h={"1.75rem"}>
                    <AddIcon/>
                </Button>
            </InputLeftElement>*/}
          <Textarea
            data-gramm_editor="false"
            rows={1}
            css={{
              resize: "none",
            }}
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

export default GuildMessage;
