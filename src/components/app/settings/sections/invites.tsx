import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const SettingsInvites = () => {
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
            <GridItem colSpan={2} h="10" />
            <GridItem colStart={5} colEnd={6}>
              <Button>Create Invite</Button>
            </GridItem>
          </Grid>

          <Center>
            <Text fontSize="xl" fontWeight="bold">
              Coming soon, this will be used to invite users to Kastel App.
            </Text>
          </Center>
          <Center>
            <Text fontSize="sm" color="gray.500">
              No invites have been created yet.
            </Text>
          </Center>
        </Stack>
      </Box>
    </>
  );
};

export default SettingsInvites;
