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
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { ChangeEvent, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { currentGuild } from "@/utils/stores.ts";

const GuildSettingsOverview = () => {
  const [guild] = useRecoilState(currentGuild);
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
  };

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        Guild Overview
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
          <Flex>
            <FormControl id="avatar">
              <Stack direction={["column", "row"]} spacing={6}>
                <Center>
                  <Avatar
                    size="xl"
                    src={selectedImage ?? guild?.icon ?? undefined}
                    name={guild?.name ?? "not found"}
                    mb={4}
                    cursor="pointer"
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
                      Change Icon
                    </Button>
                  </Box>
                </Center>
              </Stack>
            </FormControl>

            <FormControl>
              <FormLabel>Guild Name</FormLabel>
              <Input type="text" defaultValue={guild?.name} />
            </FormControl>
          </Flex>
        </Stack>
      </Box>
    </>
  );
};

export default GuildSettingsOverview;
