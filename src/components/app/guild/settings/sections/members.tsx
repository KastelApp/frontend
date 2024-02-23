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
import { useEffect, useState } from "react";
import Member from "$/Client/Structures/Guild/Member.ts";
import { clientStore } from "@/utils/stores.ts";

const GuildSettingsMembers = () => {
  const [client] = useRecoilState(clientStore);

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (!client.currentGuild?.members) return;

    setMembers(client.currentGuild?.members);
  }, [client.currentGuild?.members]);

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
                {members?.map((member, index) => {
                  console.log("called")
                  return (
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
                              src={member.user.getAvatarUrl()}
                              alt={member.user.username || "loading"}
                              fit="cover"
                            />
                            <Badge
                              boxSize="3"
                              borderRadius="full"
                              bg={
                                member.user.currentPresence === "online"
                                  ? "green.500"
                                  : member.user.currentPresence === "idle"
                                    ? "yellow.500"
                                    : member.user.currentPresence === "dnd"
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
                              {member.user.displayUsername}
                            </Text>
                            <Text fontSize="sm">
                              {member.user.fullUsername}
                            </Text>
                          </Box>
                        </Flex>
                      </Th>
                      <Th>
                        <Text>
                          {new Date(member.joinedAt).toLocaleDateString(
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
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </>
  );
};

export default GuildSettingsMembers;
