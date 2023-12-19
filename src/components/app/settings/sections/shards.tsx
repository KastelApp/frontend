import { Box, Stack, Text, useColorModeValue } from "@chakra-ui/react";

const SettingsShards = () => {
  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        Shards
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
        ></Stack>
      </Box>
    </>
  );
};

export default SettingsShards;
