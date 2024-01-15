import {
  Badge,
  Box,
  Flex,
  Image,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { currentGuild } from "@/utils/stores.ts";
import { useEffect, useState } from "react";
import { GuildMember } from "@kastelll/wrapper";

const avatars = [
  "/icon.png",
  "/icon-1.png",
  "/icon-2.png",
  "/icon-3.png",
  "/icon-4.png",
];

const GuildSettingsMembers = () => {
  const [guild] = useRecoilState(currentGuild);

  const [members, setMembers] = useState<GuildMember[]>([]);

  useEffect(() => {
    if (!guild?.members) return;
    console.log(guild?.members.toArray());

    setMembers(guild?.members.toArray());
  }, [guild?.members]);

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        Members
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
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Joined At</Th>
                </Tr>
              </Thead>
              <Tbody>
                {members?.map((member, index) => (
                  <Tr key={index}>
                    <Th>
                      <Flex py="1.5">
                        <Box
                          boxSize="30px"
                          display="inline-flex"
                          alignItems="center"
                          justifyContent="center"
                          overflow="visible"
                          lineHeight="none"
                          borderRadius="full"
                          position="relative"
                        >
                          <Image
                            draggable={"false"}
                            borderRadius={"full"}
                            src={
                              member?.user?.getAvatarUrl({ size: 128 }) ?? ""
                            }
                            fallbackSrc={
                              avatars[
                                Number(
                                  BigInt(member?.user?.id || 1) %
                                    BigInt(avatars.length),
                                )
                              ] || "/icon-1.png"
                            }
                            alt={member?.user?.username || "loading"}
                            fit="cover"
                          />
                          <Badge
                            boxSize="3"
                            borderRadius="full"
                            bg={
                              member?.user?.presence === "online"
                                ? "green.500"
                                : member?.user?.presence === "idle"
                                  ? "yellow.500"
                                  : member?.user?.presence === "dnd"
                                    ? "red.500"
                                    : "gray.500"
                            }
                            position="absolute"
                            bottom="-0.5"
                            right="-0.5"
                          />
                        </Box>
                        <Box ml="3">
                          <Text>
                            {member?.user?.globalNickname ??
                              member?.user?.username}
                          </Text>
                          <Text fontSize="sm">
                            {member?.user?.username}#
                            {member?.user?.discriminator}
                          </Text>
                        </Box>
                      </Flex>
                    </Th>
                    <Th>
                      <Text>
                        {new Date(member?.joinedAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </Text>
                    </Th>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </>
  );
};

export default GuildSettingsMembers;
