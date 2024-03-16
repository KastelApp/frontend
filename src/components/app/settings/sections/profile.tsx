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
  Grid,
  GridItem,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { SmallCloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { hideEmail } from "@/utils/hideEmail.ts";
import { useUserStore } from "$/utils/Stores.ts";

const SettingsProfile = () => {
  const toast = useToast();
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showEmail, setShowEmail] = useState<boolean>(false);
  const [changeEmail, setChangeEmail] = useState<boolean>(false);
  const [detectedChanges, setDetectedChanges] = useState<boolean>(false);
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
  const user = useUserStore((s) => s.getCurrentUser()!);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    const hash = await user.uploadAvatar(file); // todo: fix cors error

    if (hash.success) {
      await user.updateUser({
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
        discriminator: {
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
      tag?: string;
    } = {
      password: currentPassword,
    };

    if (event.target.discriminator) {
      if (event.target.discriminator.value.length !== 4) {
        setError([
          {
            code: "INVALID_DISCRIMINATOR",
            message: "Discriminator must be 4 digits long",
          },
        ]);
        setLoading(false);
        return;
      }
      data = {
        ...data,
        tag: event.target.discriminator.value,
      };
    }

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

    console.log(data);

    const res = await user.updateUser(data);

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
    
    await user.updateUser({
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
                  draggable={"false"}
                  size="xl"
                  src={
                    selectedImage ??
                    user.getAvatarUrl({
                      size: 256,
                    })
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

          <Grid templateColumns="repeat(5, 1fr)" gap={5}>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  onChange={() => setDetectedChanges(true)}
                  id={"username"}
                  defaultValue={user?.username}
                  type="text"
                />
              </FormControl>
            </GridItem>
            <GridItem colStart={4} colEnd={6}>
              <FormControl>
                <FormLabel>Discriminator</FormLabel>
                <InputGroup>
                  <Input
                    onChange={() => setDetectedChanges(true)}
                    id={"discriminator"}
                    defaultValue={user?.tag}
                    type="text"
                    maxLength={4}
                  />
                </InputGroup>
              </FormControl>
            </GridItem>
          </Grid>
          <br />
          <Grid templateColumns="repeat(5, 1fr)" gap={5}>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Email address</FormLabel>
                <Flex>
                  <Text>
                    {showEmail
                      ? user?.email || ""
                      : hideEmail(user?.email || "")}
                  </Text>

                  <Button
                    cursor={"pointer"}
                    colorScheme={"cyan"}
                    ml={2}
                    variant="link"
                    onClick={() => setShowEmail(!showEmail)}
                  >
                    {showEmail ? "Hide" : "Show"}
                  </Button>
                </Flex>
              </FormControl>
            </GridItem>

            <GridItem colStart={4} colEnd={6}>
              <Button
                onClick={() => {
                  setChangeEmail(!changeEmail);
                }}
              >
                {changeEmail ? "Cancel Email Change" : "Change Email"}
              </Button>
            </GridItem>
          </Grid>

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
            <Flex mt={5} gap="2">
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
