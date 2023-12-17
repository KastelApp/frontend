// import { useRecoilState } from "recoil";
// import { clientStore } from "@/utils/stores";

import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";

export default function Settings_Profile({ userInfo }) {
  // const [client] = useRecoilState(clientStore);
  const [selectedImage, setSelectedImage] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }

    const Hash = await userInfo.uploadAvatar(file);

    console.log(Hash);
  };


  return (
    <>
      <Box p={6} mt={10} as="form">
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <FormControl id="userName">
            <FormLabel>User Icon</FormLabel>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  src={selectedImage || userInfo?.getAvatarUrl({
                    size: 256,
                  })}
                  name="avatar-preview"
                  mb={4}
                  cursor="pointer"
                  onClick={() => {
                    const input = fileInputRef.current;
                    if (input) {
                      input.click();
                    }
                  }}
                >
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
              </Center>
              <Center w="full">
                <Button w="full">Change Icon</Button>
              </Center>
            </Stack>
          </FormControl>
        </Stack>
      </Box>

      {userInfo?.username || "Loading..."}
    </>
  );
}
