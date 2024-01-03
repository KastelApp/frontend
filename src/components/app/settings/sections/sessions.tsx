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
import { clientStore } from "@/utils/stores.ts";
import { useEffect } from "react";

const SettingsSessions = () => {
  const [client] = useRecoilState(clientStore);

  useEffect(() => {
    if (!client) return;
  }, [client]);

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        Sessions
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
            <Table>
              <Thead>
                <Th>Device</Th>
                <Th>Last Used</Th>
                <Th>Reigon</Th>
                <Th>Actions</Th>
              </Thead>

              <Tbody>
                <Tr>
                  <Th>Desktop Client</Th>
                  <Th>12 hrs ago</Th>
                  <Th>Charlotte, NC, United States</Th>
                  <Th>
                    <Stack direction="row">
                      <Text color="red.500">Revoke</Text>
                    </Stack>
                  </Th>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </>
  );
};

export default SettingsSessions;
