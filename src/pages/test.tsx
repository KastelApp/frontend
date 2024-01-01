import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import AppNavbar from "@/components/app/navbar.tsx";

const Test = () => {
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <>
      <AppNavbar />
      <Flex height="100vh">
        {/* Left sidebar */}
        <Box
          pb="10"
          overflowX="hidden"
          overflowY="scroll"
          color="inherit"
          borderRightWidth="1px"
          borderRightColor={borderColor}
          w={"200px"}
        >
          {/* Content for left sidebar */}
        </Box>

        {/* Main content */}
        <Box flex="1" overflowY="scroll">
          <Flex w="full" h="14" alignItems="center" marginTop={"500px"} px="3">
            <InputGroup>
              {/*<InputLeftElement>
                <Button w={"1rem"} h={"1.75rem"}>
                    <AddIcon/>
                </Button>
            </InputLeftElement>*/}
              <Input
                bg={useColorModeValue("gray.200", "gray.800")}
                border={0}
                color={useColorModeValue("gray.900", "gray.100")}
                _placeholder={{
                  color: useColorModeValue("gray.500", "gray.100"),
                }}
                placeholder={"Message #hello"}
              />
              <InputRightElement width="4rem">
                <Button h={"1.75rem"} w={"1.5rem"}>
                  <ChatIcon />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Flex>
        </Box>

        {/* Right sidebar */}
        <Box
          pb="10"
          overflowX="hidden"
          overflowY="scroll"
          color="inherit"
          borderLeftWidth="1px"
          borderLeftColor={borderColor}
          w={"200px"}
        >
          {/* Content for right sidebar */}
        </Box>
      </Flex>
    </>
  );
};

export default Test;
