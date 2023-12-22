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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  RepeatIcon,
  SmallCloseIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { clientStore } from "@/utils/stores.ts";
import { useRecoilState } from "recoil";
import { hideEmail } from "@/utils/hideEmail.ts";

const SettingsProfile = () => {
  const toast = useToast();
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [changeEmail, setChangeEmail] = useState<boolean>(false);
  const [detectedChanges, setDetectedChanges] = useState<boolean>(false);
  const [client] = useRecoilState(clientStore);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<
    {
      code: string;
      message: string;
    }[]
  >([]);
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    const hash = await client.user.uploadAvatar(file); // todo: fix cors error
    if (hash.success) {
      await client.user.updateUser({
        avatar: hash.hash,
      });
      toast({
        title: "Avatar updated.",
        description: "Your avatar has been updated.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
    console.log(hash);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement> & {
      target: {
        username: {
          value: string;
        };
        email: {
          value: string;
        };
        currentPassword: {
          value: string;
        };
        newPassword: {
          value: string;
        };
        confirmNewPassword: {
          value: string;
        };
      };
    },
  ) => {
    event.preventDefault();
    setLoading(true);
    setError([]);

    const currentPassword = event.target.currentPassword.value;
    if (!currentPassword) {
      setError([
        {
          code: "MISSING_CURRENT_PASSWORD",
          message: "Please enter your password to make changes",
        },
      ]);
      setLoading(false);
      return;
    }

    let data: {
      username?: string;
      email?: string;
      newPassword?: string;
      password: string;
    } = {
      password: currentPassword,
    };

    if (event.target.username) {
      data = {
        ...data,
        username: event.target.username.value,
      };
    }

    if (event.target.email) {
      data = {
        ...data,
        email: event.target.email.value,
      };
    }

    if (event.target.newPassword) {
      const newPassword = event.target.newPassword.value;
      const confirmNewPassword = event.target.confirmNewPassword.value;

      if (newPassword !== confirmNewPassword) {
        setError([
          {
            code: "PASSWORDS_DONT_MATCH",
            message: "Passwords don't match",
          },
        ]);
        setLoading(false);
        return;
      } else {
        data = {
          ...data,
          newPassword: newPassword,
        };
      }
    }

    const res = await client.user.updateUser(data);

    console.log(res);

    setLoading(false);
    toast({
      title: "Profile updated.",
      description: "Your profile has been updated.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const handleDelete = async () => {
    setSelectedImage("/icon-1.png");
    await client.user.updateUser({
      avatar: null,
    });
    toast({
      title: "Avatar removed.",
      description: "Your avatar has been removed.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        My Profile
      </Text>

      <Box mt={50} as="form" onSubmit={handleSubmit}>
        <Stack
          spacing={4}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <FormControl id="avatar">
            <FormLabel>User Avatar</FormLabel>
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
                >
                  <AvatarBadge
                    onClick={handleDelete}
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
                  id="avatar"
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
                <Box ml={2}>
                  <Button
                    onClick={() => {
                      const input = fileInputRef.current;
                      if (input) {
                        input.click();
                      }
                    }}
                  >
                    Change Avatar
                  </Button>
                </Box>
              </Center>
            </Stack>
          </FormControl>

          {error.length > 0 && (
            <center>
              <Text
                mt={-3}
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                {error.map((err) => {
                  return err.message;
                })}
              </Text>
            </center>
          )}

          <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
            <center>
              <ModalOverlay />
              <ModalContent>
                <ModalBody mt={5}>
                  <Text>
                    Are you sure you want to change your discriminator? Your new
                    discriminator will be randomly generated.
                  </Text>

                  <Text as={"b"}>This is not reversible.</Text>
                </ModalBody>

                <ModalFooter display={"unset"}>
                  <Button
                    _hover={{
                      bgGradient: "linear(to-r, red.300,pink.400)",
                      boxShadow: "xl",
                    }}
                    bgGradient="linear(to-r, red.400,pink.400)"
                    mr={3}
                    onClick={() => {
                      onClose();
                      toast({
                        title: "Not Done",
                        description: "This is in progress.",
                        status: "warning",
                        duration: 9000,
                        isClosable: true,
                      });
                    }}
                  >
                    Confirm
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </center>
          </Modal>

          <Flex gap={"2"}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                onChange={() => setDetectedChanges(true)}
                id={"username"}
                defaultValue={client?.user?.username}
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Discriminator</FormLabel>
              <InputGroup>
                <Input
                  readOnly={true}
                  defaultValue={client?.user?.discriminator}
                  type="text"
                />
                <InputRightElement width="3rem">
                  <Button onClick={onToggle} h="1.75rem" size="sm">
                    <RepeatIcon />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Flex>

          <FormControl>
            <FormLabel>Email address</FormLabel>
            <InputGroup>
              <Input
                type={"email"}
                readOnly={true}
                defaultValue={hideEmail(client?.user?.email || "")}
              />
              <InputRightElement w={"fit-content"}>
                <Button
                  mr={2}
                  h="1.75rem"
                  onClick={() => setChangeEmail((changeEmail) => !changeEmail)}
                >
                  {changeEmail ? "Cancel Email Change" : "Change Email"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          {changeEmail && (
            <>
              <FormControl>
                <FormLabel>New Email address</FormLabel>
                <InputGroup>
                  <Input
                    onChange={() => setDetectedChanges(true)}
                    type={"email"}
                    id={"email"}
                  />
                  <InputRightElement w={"fit-content"}></InputRightElement>
                </InputGroup>
              </FormControl>
            </>
          )}

          {detectedChanges && <Divider my={4} />}

          {detectedChanges && (
            <FormControl>
              <FormLabel>Current Password</FormLabel>
              <InputGroup>
                <Input
                  id={"currentPassword"}
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement h={"full"}>
                  <Button
                    mr={2}
                    h="1.75rem"
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          )}

          {changePassword && (
            <>
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input
                  onChange={() => setDetectedChanges(true)}
                  id={"newPassword"}
                  type={showPassword ? "text" : "password"}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  id={"confirmNewPassword"}
                  type={showPassword ? "text" : "password"}
                />
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
              <Button
                isDisabled={!detectedChanges}
                isLoading={loading}
                type={detectedChanges ? "submit" : "button"}
              >
                Save Changes
              </Button>
            </Flex>
          </Center>
        </Stack>
      </Box>
    </>
  );
};

export default SettingsProfile;
