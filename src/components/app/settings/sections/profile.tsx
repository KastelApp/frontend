import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { SmallCloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { ChangeEvent, useRef, useState } from "react";
import { clientStore } from "@/utils/stores.ts";
import { useRecoilState } from "recoil";

const SettingsProfile = () => {
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
      <Text fontSize="xl" fontWeight="bold">
        My Profile
      </Text>

      <Box mt={50} as="form">
        <Stack
          spacing={4}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
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
            </Stack>
          </FormControl>

          <Flex gap={"2"}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input defaultValue={client?.user?.username} type="text" />
            </FormControl>
            <FormControl>
              <FormLabel>Discriminator</FormLabel>
              <InputGroup>
                <Input
                  readOnly={true}
                  defaultValue={client?.user?.discriminator}
                  type="text"
                />
                <InputRightElement width="4.5rem">
                  <Button mr={2} h="1.75rem" size="sm">
                    Update
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Flex>

          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input type="email" />
          </FormControl>

          {changePassword && (
            <>
              <Divider my={4} />
              <FormControl>
                <FormLabel>Current Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? "text" : "password"} />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input type={showPassword ? "text" : "password"} />
              </FormControl>
              <FormControl>
                <FormLabel>Confirm New Password</FormLabel>
                <Input type={showPassword ? "text" : "password"} />
              </FormControl>
            </>
          )}

          <Center>
            <Flex gap="2">
              <Button
                onClick={() => {
                  setChangePassword(!changePassword);
                }}
              >
                {changePassword ? "Cancel Password Change" : "Change Password"}
              </Button>
              <Button>Save Changes</Button>
            </Flex>
          </Center>
        </Stack>
      </Box>
    </>
  );
};

export default SettingsProfile;
