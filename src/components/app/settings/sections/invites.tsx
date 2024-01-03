import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Spacer,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";

const SettingsInvites = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        Invites
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
          <Grid templateColumns="repeat(5, 1fr)" gap={5}>
            <GridItem colSpan={2}>
              <Text fontSize="xl" fontWeight="bold">
                Invite a friend!
              </Text>
            </GridItem>
            <GridItem colEnd={6}>
              <Button onClick={() => setShow(!show)}>Create Invite</Button>
            </GridItem>
          </Grid>

          <Spacer />

          {show ? (
            <TableContainer>
              <Table>
                <TableCaption>
                  <Text>You have 0 invites left.</Text>
                </TableCaption>
                <Thead>
                  <Th>Invite Code</Th>
                  <Th>Uses</Th>
                  <Th>Last Used</Th>
                </Thead>

                <Tbody>
                  <Tr>
                    <Td>
                      <Text fontWeight="bold">123456</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">0 / 0</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">Never</Text>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Center>
              <Text fontWeight="bold">No invites have been created yet.</Text>
            </Center>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default SettingsInvites;
