import {
  Box,
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
import { useEffect } from "react";

const GuildSettingsMembers = () => {
  const [guild] = useRecoilState(currentGuild);

  useEffect(() => {
    console.log(guild?.members);
  }, []);

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
                  <Th>User</Th>
                  <Th>Joined At</Th>
                </Tr>
              </Thead>
              <Tbody></Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </>
  );
};

export default GuildSettingsMembers;
