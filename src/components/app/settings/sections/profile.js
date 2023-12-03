// import { useRecoilState } from "recoil";
// import { clientStore } from "@/utils/stores";

import {
    Avatar,
    AvatarBadge,
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Stack, useColorModeValue
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";

export default function Settings_Profile({ userInfo }) {
  // const [client] = useRecoilState(clientStore);

  return (
      <>
          <Box
              p={6}
              mt={10}
              as="form">
              <Stack
                  spacing={4}
                  w={"full"}
                  maxW={"md"}
                  bg={useColorModeValue("white", "gray.700")}
                  rounded={"xl"}
                  boxShadow={"lg"}
                  p={6}
                  my={12}>
              <FormControl id="userName">
                  <FormLabel>User Icon</FormLabel>
                  <Stack direction={["column", "row"]} spacing={6}>
                      <Center>
                          <Avatar size="xl" src="">
                              <AvatarBadge
                                  as={IconButton}
                                  size="sm"
                                  rounded="full"
                                  top="-10px"
                                  colorScheme="red"
                                  aria-label="remove Image"
                                  icon={<SmallCloseIcon />}
                              />
                          </Avatar>
                      </Center>
                      <Center w="full">
                          <Button w="full">Change Icon</Button>
                      </Center>
                  </Stack>
              </FormControl>
              </Stack>
          </Box>
      </>
  )
}
