import { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSettingsStore, useUserStore } from "$/utils/Stores.ts";
import Emoji from "../../markdown/components/emoji.tsx";

const SettingsAppearance = () => {
  const { settings, setSettings } = useSettingsStore();
  const fontSizes = [12, 14, 16, 18, 20, 24, 28];
  const [at, setAt] = useState(14);
  const { getCurrentUser } = useUserStore();
  const user = getCurrentUser();

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        Appearance
      </Text>
      <VStack
        spacing={8}
        align="start"
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={6}
      >
        <Box ml={5} w="full">
          {/* Additional settings */}
          <VStack spacing={4} mt={2} align="start">
            <Text fontSize="lg" fontWeight="medium">
              Theme
            </Text>
            <ButtonGroup spacing={4}>
              <Button
                onClick={() => {
                  setSettings({
                    ...settings,
                    theme: "light",
                  });

                  void user?.updateSettings({
                    theme: "light",
                  });
                }}
                colorScheme={settings.theme === "light" ? "blue" : "gray"}
              >
                Light
              </Button>
              <Button
                onClick={() => {
                  setSettings({
                    ...settings,
                    theme: "dark",
                  });

                  void user?.updateSettings({
                    theme: "dark",
                  });
                }}
                colorScheme={settings.theme === "dark" ? "blue" : "gray"}
              >
                Dark
              </Button>
              <Button
                onClick={() => {
                  setSettings({
                    ...settings,
                    theme: "system",
                  });

                  void user?.updateSettings({
                    theme: "system",
                  });
                }}
                colorScheme={settings.theme === "system" ? "blue" : "gray"}
              >
                System
              </Button>
            </ButtonGroup>
          </VStack>

          {/* the navbar location */}
          <VStack spacing={4} mt={8} align="start">
            <Text fontSize="lg" fontWeight="medium">
              Navbar Location
            </Text>
            <ButtonGroup spacing={4}>
              <Button
                onClick={() => {
                  setSettings({
                    ...settings,
                    navBarLocation: "left",
                  });

                  void user?.updateSettings({
                    navBarLocation: "left",
                  });
                }}
                colorScheme={
                  settings.navBarLocation === "left" ? "blue" : "gray"
                }
              >
                Left
              </Button>
              <Button
                onClick={() => {
                  setSettings({
                    ...settings,
                    navBarLocation: "bottom",
                  });

                  void user?.updateSettings({
                    navBarLocation: "bottom",
                  });
                }}
                colorScheme={
                  settings.navBarLocation === "bottom" ? "blue" : "gray"
                }
              >
                Bottom
              </Button>
            </ButtonGroup>
          </VStack>

          {/* The emoji pack */}
          <VStack spacing={4} mt={8} align="start">
            <Text fontSize="lg" fontWeight="medium">
              Emoji Pack
            </Text>
            <ButtonGroup spacing={4}>
              <Button
                onClick={() => {
                  setSettings({
                    ...settings,
                    emojiPack: "twemoji",
                  });

                  void user?.updateSettings({
                    emojiPack: "twemoji",
                  });
                }}
                colorScheme={settings.emojiPack === "twemoji" ? "blue" : "gray"}
              >
                Twemoji
                <Box ml={2}>
                  <Emoji emoji="grinning_face" pack="twemoji" />
                </Box>
              </Button>
              <Button
                onClick={() => {
                  setSettings({
                    ...settings,
                    emojiPack: "noto-emoji",
                  });

                  void user?.updateSettings({
                    emojiPack: "noto-emoji",
                  });
                }}
                colorScheme={
                  settings.emojiPack === "noto-emoji" ? "blue" : "gray"
                }
              >
                Noto Emoji (Google)
                <Box ml={2}>
                  <Emoji emoji="grinning_face" pack="noto-emoji" />
                </Box>
              </Button>
              <Button
                onClick={() => {
                  setSettings({
                    ...settings,
                    emojiPack: "fluentui-emoji",
                  });

                  void user?.updateSettings({
                    emojiPack: "fluentui-emoji",
                  });
                }}
                colorScheme={
                  settings.emojiPack === "fluentui-emoji" ? "blue" : "gray"
                }
              >
                FluentUI Emoji (Microsoft)
                <Box ml={2}>
                  <Emoji emoji="grinning_face" pack="fluentui-emoji" />
                </Box>
              </Button>
              <Button
                onClick={() => {
                  setSettings({
                    ...settings,
                    emojiPack: "native",
                  });

                  void user?.updateSettings({
                    emojiPack: "native",
                  });
                }}
                colorScheme={settings.emojiPack === "native" ? "blue" : "gray"}
              >
                Native
                <Box ml={2}>
                  <Emoji emoji="grinning_face" pack="native" />
                </Box>
              </Button>
            </ButtonGroup>
          </VStack>

          {/* font size (WIP) */}
          <VStack
            spacing={4}
            mt={8}
            align="start"
            w="full"
            maxW="calc(100% - 100px)"
          >
            <Text fontSize="lg" fontWeight="medium" mb={4}>
              Font Size (WIP)
            </Text>
            <Slider
              min={0}
              max={fontSizes.length - 1}
              step={1}
              value={fontSizes.indexOf(at)}
              onChange={(val) => {
                setAt(fontSizes[val]);
              }}
            >
              {fontSizes.map((size, index) => (
                <SliderMark
                  key={size}
                  value={index}
                  top={"-30px"}
                  left={
                    index === 0
                      ? "0%"
                      : `${(index / (fontSizes.length - 1)) * 100 - 1}% !important`
                  }
                  fontSize="sm"
                >
                  {size}px
                </SliderMark>
              ))}
              <SliderTrack h={"15px"}>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </VStack>
        </Box>
      </VStack>
    </>
  );
};

export default SettingsAppearance;
