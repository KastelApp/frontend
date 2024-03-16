import { useState } from "react";
import { Box, Button, ButtonGroup, Circle, HStack, Text, useColorMode } from "@chakra-ui/react";
import { BsMoonStarsFill, BsSun } from "react-icons/bs";
import { useSettingsStore } from "$/utils/Stores.ts";

const SettingsAppearance = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [selectedTheme] = useState<string>(colorMode);
  const { settings, setSettings } = useSettingsStore();

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
          {/* <Circle
            size="50px"
            cursor="pointer"
            border={selectedTheme === "dark" ? "2px solid white" : "none"}
          /> */}
          <Button onClick={() => {
            setSettings({
              ...settings,
              navBarLocation: settings.navBarLocation === "left" ? "bottom" : "left"
            });
          }}>
            Navbar Location: {settings.navBarLocation === "left" ? "Left" : "Bottom"}
          </Button>
          {/* 4 buttons which let the user choose what emoji pack they can use, the options are "Tweomji", "noto-emoji (Googles)", and "fluentui-emoji" (Microsofts) or "Native" */}
          <ButtonGroup
            spacing={4}
            mt={4}
          >
            <Button
              onClick={() => {
                setSettings({
                  ...settings,
                  emojiPack: "twemoji"
                });
              }}
              colorScheme={settings.emojiPack === "twemoji" ? "blue" : "gray"}
            >
              Twemoji
            </Button>
            <Button
              onClick={() => {
                setSettings({
                  ...settings,
                  emojiPack: "noto-emoji"
                });
              }}
              colorScheme={settings.emojiPack === "noto-emoji" ? "blue" : "gray"}
            >
              Noto Emoji (Google)
            </Button>
            <Button
              onClick={() => {
                setSettings({
                  ...settings,
                  emojiPack: "fluentui-emoji"
                });
              }}
              colorScheme={settings.emojiPack === "fluentui-emoji" ? "blue" : "gray"}
            >
              FluentUI Emoji (Microsoft)
            </Button>
            <Button
              onClick={() => {
                setSettings({
                  ...settings,
                  emojiPack: "native"
                });
              }}
              colorScheme={settings.emojiPack === "native" ? "blue" : "gray"}
            >
              Native
            </Button>
          </ButtonGroup>
        </HStack>
      </Box>
    </>
  );
};

export default SettingsAppearance;
