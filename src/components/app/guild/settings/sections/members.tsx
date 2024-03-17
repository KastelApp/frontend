import {
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
import { useMemberStore, useUserStore } from "$/utils/Stores.ts";

const GuildSettingsMembers = () => {
  const { users } = useUserStore();
  const { getCurrentMembers } = useMemberStore();
  const members = getCurrentMembers();

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
                  const user = users.find((user) => user.id === member.userId)!;

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
                              src={user.getAvatarUrl()}
                              alt={user.username ?? "loading"}
                              fit="cover"
                            />
                          </Box>
                          <Box ml="3">
                            <Text>
                              {member.displayUsername}
                            </Text>
                            <Text fontSize="sm">
                              {user.fullUsername}
                            </Text>
                          </Box>
                        </Flex>
                      </Th>
                      <Th>
                        <Text>
                          {member.joinedAt.toLocaleDateString(
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
