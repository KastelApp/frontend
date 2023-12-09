import {
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import pack from "../../../../package.json";
import generatedGitInfo from "../../../generatedGitInfo.json";

const data = [
  {
    name: "Profile",
    options: [
      {
        name: "My Profile",
        badges: [],
        id: 0,
      },
      {
        name: "Privacy & Safety",
        badges: [],
        id: 1,
      },
      {
        name: "Sessions",
        badges: [
          {
            name: "Beta",
            color: "#4F2D7C",
          },
        ],
        id: 2,
      },
    ],
  },
  {
    name: "General Settings",
    options: [
      {
        name: "Appearance",
        badges: [],
        id: 3,
      },
      {
        name: "Accessibility",
        badges: [],
        id: 4,
      },
      {
        name: "Text & Language",
        badges: [],
        id: 5,
      },
    ],
  },
  {
    name: "Billing",
    options: [
      {
        name: "Subscriptions",
        badges: [],
        id: 6,
      },

      {
        name: "Shards",
        badges: [],
        id: 7,
      },
      {
        name: "Details & History",
        badges: [],
        id: 8,
      },
    ],
  },
];

export default function Settings_Sidebar({
  selectedPage,
  setSelectedPage,
  children,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box minH="100vh">
        <SidebarContent
          setSelectedPage={setSelectedPage}
          selectedPage={selectedPage}
          onClose={() => onClose}
          display={{ base: "none", md: "block" }}
        />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent
              setSelectedPage={setSelectedPage}
              selectedPage={selectedPage}
              onClose={onClose}
            />
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
        <Box ml={{ base: 0, md: 60 }} p="4">
          {children}
        </Box>
      </Box>
    </>
  );
}

const SidebarContent = ({
  selectedPage,
  setSelectedPage,
  onClose,
  ...rest
}) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      overflow={"scroll"}
      {...rest}
    >
      <Box flex="1">
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          {/*
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Kastel
        </Text>
        */}
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        {data.map((section, index) => (
          <div key={index}>
            <Text
              ml="8"
              mt="4"
              mb="2"
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wide"
              color="gray.500"
            >
              {section.name}
            </Text>
            {section.options.map((option) => (
              <NavItem
                key={option.name}
                selectedPage={selectedPage}
                id={option.id}
                onClick={() => setSelectedPage(option.id)}
                icon={option.icon}
              >
                {option.name}
                {option.badges && option.badges.length === 1 && (
                  <Box
                    bg={option.badges[0].color}
                    ml="auto"
                    mr="2"
                    borderRadius="lg"
                    px="2"
                    py="1"
                    fontSize="xs"
                    fontWeight="bold"
                    color="white"
                  >
                    {option.badges[0].name}
                  </Box>
                )}
              </NavItem>
            ))}
          </div>
        ))}
      </Box>

      {/* Build info very bottom of sidebar */}
      <Box>
        <Text
          as="sub"
          ml="8"
          fontSize="xs"
          fontWeight="bold"
          letterSpacing="wide"
          color="gray.500"
          mb="5"
          textTransform="uppercase"
        >
          {generatedGitInfo.gitBranch} {pack?.version || "0.0.0"} (
          {generatedGitInfo.gitCommitHash})
        </Text>
      </Box>
    </Box>
  );
};

const NavItem = ({ selectedPage, id, icon, children, ...rest }) => {
  return (
    <Box
      as="a"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      {selectedPage === id ? (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={"gray.700"}
          color={"white"}
          _hover={{
            bg: "gray.600",
            color: "white",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      ) : (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "gray.800",
            color: "white",
          }}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: "white",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      )}
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      {/*
      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Kastel
      </Text>
      */}
    </Flex>
  );
};
