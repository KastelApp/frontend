import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Circle,
  HStack,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsSun, BsMoonStarsFill } from "react-icons/bs";

const SettingsAppearance = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [selectedTheme, setSelectedTheme] = useState<string>(colorMode);

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        Appearance
      </Text>

      <Box ml={10} mt={10}>
        <HStack spacing={4} mt={4}>
          <Circle
            onClick={toggleColorMode}
            bg="white"
            size="50px"
            cursor="pointer"
            border={selectedTheme === "light" ? "2px solid black" : "none"}
          >
            <BsSun color={"black"} />
          </Circle>

          <Circle
            onClick={toggleColorMode}
            bg={"gray.800"}
            size="50px"
            cursor="pointer"
            border={selectedTheme === "dark" ? "2px solid white" : "none"}
          >
            <BsMoonStarsFill color={"white"} />
          </Circle>
          {/*<Circle
            size="50px"
            cursor="pointer"
            border={selectedTheme === "dark" ? "2px solid white" : "none"}
          />*/}
        </HStack>
      </Box>
    </>
  );
};

export default SettingsAppearance;
