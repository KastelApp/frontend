import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  IconButton,
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
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { CopyIcon } from "@chakra-ui/icons";

const SettingsInvites = () => {
  const [show, setShow] = useState(false);
  const { onCopy, setValue, hasCopied } = useClipboard("");

  const handleCopy = (code: string) => {
    setValue(`${code}`);
    onCopy();
  };

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
                <TableCaption color={"inherit"}>
                  <Text>You have 0 invites left.</Text>
                </TableCaption>
                <Thead>
                  <Th>Invite Code</Th>
                  <Th>Used By</Th>
                  <Th>Used At</Th>
                  <Th>Expires</Th>
                </Thead>

                <Tbody>
                  <Tr>
                    <Td>
                      <Flex>
                        <Text fontWeight="bold">123456</Text>
                        <IconButton
                          h={5}
                          minW={"unset"}
                          variant={"ghost"}
                          aria-label={"copy"}
                          bg={hasCopied ? "gray.900" : "inherit"}
                          color={hasCopied ? "green.500" : "inherit"}
                          ml={2}
                          cursor={"pointer"}
                          onClick={() => handleCopy("1233456")}
                          icon={<CopyIcon />}
                        />
                      </Flex>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">User#0001</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">N/A</Text>
                    </Td>
                    <Td>
                      <Text fontWeight="bold">24hrs 30mins</Text>
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
