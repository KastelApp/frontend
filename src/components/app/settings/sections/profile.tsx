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
import { ChangeEvent, useRef, useState } from "react";
import { clientStore } from "@/utils/stores.ts";
import { useRecoilState } from "recoil";

const SettingsProfile = () => {
  const [client] = useRecoilState(clientStore);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    const hash = await client.user.uploadAvatar(file); // todo: fix cors error

    console.log(hash);
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
                  src={
                    selectedImage ??
                    client.user.getAvatarUrl({
                      size: 256,
                    }) ??
                    "/icon-1.png"
                  }
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

      {client.user.username}
    </>
  );
};

export default SettingsProfile;
