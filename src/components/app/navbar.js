import {
  Box,
  Circle,
  CloseButton,
  Divider,
  Drawer,
  DrawerContent,
  Flex,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import MobileNavbar from "@/components/app/mobile-navbar";
import NewServer from "@/components/app/new-server";

export default function AppNavbar({ userInfo, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh">
      {/*
            guilds={userInfo?.Guilds}
            */}

      <SidebarContent
        userInfo={userInfo}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />

      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          {/* guilds={userInfo?.Guilds}
           */}
          <SidebarContent userInfo={userInfo} onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <MobileNavbar userInfo={userInfo} onOpen={onOpen} />

      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ userInfo, guilds, onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: "10%" }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="5" justifyContent="space-between">
        <NextLink href={"/app/"} passHref>
          <Text
            as={"a"}
            fontSize="2xl"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Kastel
          </Text>
        </NextLink>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      <Divider />
      {/* Guild Listing */}

      <Stack
        h="20"
        mt={5}
        alignItems="center"
        mx="8"
        justifyContent="space-between"
      >
        {guilds &&
          guilds.map((guild) => {
            return <GuildItem guild={guild} key={guild.Id} />;
          })}

        <Tooltip hasArrow label="Create new guild" placement="right">
          <NewServer userInfo={userInfo} />
        </Tooltip>
      </Stack>
    </Box>
  );
};

const GuildItem = ({ guild }) => {
  return (
    <NextLink
      href={
        "/app/channels/" + guild?.Id ||
        "0" + "/" + guild?.Channels[0]?.Id ||
        "0"
      }
      passHref
    >
      <Box marginBottom={2}>
        <Tooltip
          color={useColorModeValue("gray.800", "white")}
          bg={useColorModeValue("white", "gray.700")}
          hasArrow
          label={guild?.Name || "Unknown"}
          placement="right"
        >
          <Circle
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="full"
            alt={guild?.Name || "Unknown"}
            boxSize="40px"
          >
            <Text>{guild?.Name?.charAt(0) || "U"}</Text>
          </Circle>
        </Tooltip>
      </Box>
    </NextLink>
  );
};
