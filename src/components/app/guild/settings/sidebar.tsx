import {
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { ElementType, ReactNode } from "react";
import DeleteGuildPopup from "./deleteGuildPopup.tsx";

const GuildSettingsSidebar = ({
  selectedPage,
  setSelectedPage,
  children,
}: {
  selectedPage: number;
  setSelectedPage: (page: number) => void;
  children?: ReactNode;
}) => {
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
};

const SidebarContent = ({
  selectedPage,
  setSelectedPage,
  onClose,
  ...rest
}: {
  selectedPage: number;
  setSelectedPage: (page: number) => void;
  onClose: () => void;
  [x: string]: unknown;
}) => {
  const { isOpen, onOpen, onClose: closeModal } = useDisclosure();

  return (
    <Box
      bg={useColorModeValue("#e6e9ef", "#101319")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      overflow={"scroll"}
      {...rest}
    >
      <DeleteGuildPopup
        isOpen={isOpen}
        onClose={closeModal}
        closeSettings={onClose}
      />
      <Box flex="1">
        <Flex alignItems="center" mx="8" justifyContent="space-between">
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>

        {/* Guild Settings */}
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
          Guild Settings
        </Text>
        <NavItem
          mt={1}
          selectedPage={selectedPage}
          onClick={() => {
            onClose();
            setSelectedPage(0);
          }}
        >
          Overview
        </NavItem>

        <NavItem
          mt={1}
          selectedPage={selectedPage}
          onClick={() => {
            onClose();
            setSelectedPage(1);
          }}
        >
          Roles
        </NavItem>

        {/* User Management */}
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
          User Management
        </Text>

        <NavItem
          mt={1}
          selectedPage={selectedPage}
          onClick={() => {
            onClose();
            setSelectedPage(2);
          }}
        >
          Co Owners
        </NavItem>

        <NavItem
          mt={1}
          selectedPage={selectedPage}
          onClick={() => {
            onClose();
            setSelectedPage(3);
          }}
        >
          Invites
        </NavItem>

        <NavItem
          mt={1}
          selectedPage={selectedPage}
          onClick={() => {
            onClose();
            setSelectedPage(4);
          }}
        >
          Bans
        </NavItem>

        <NavItem
          mt={1}
          selectedPage={selectedPage}
          onClick={() => {
            onClose();
            setSelectedPage(5);
          }}
        >
          Members
        </NavItem>
        <NavItem
          mt={1}
          border="2px solid hsl(339, 90%, 51%, 1)"
          color="hsl(339, 90%, 51%, 1)"
          _hover={{
            color: "hsl(339, 90%, 41%, 1)",
            borderColor: "hsl(339, 90%, 41%, 1)",
          }}
          selectedPage={0}
          onClick={() => {
            onOpen();
          }}
        >
          Delete Guild
        </NavItem>
      </Box>
    </Box>
  );
};

const NavItem = ({
  selectedPage,
  id,
  icon,
  children,
  ...rest
}: {
  selectedPage: number;
  id?: number;
  icon?: ElementType | null;
  children?: ReactNode;
} & FlexProps) => {
  const background = useColorModeValue("gray.100", "gray.700");
  const backgroundHover = useColorModeValue("gray.200", "gray.600");

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
          bg={background}
          _hover={{
            bg: backgroundHover,
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
            bg: background,
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

const MobileNav = ({
  onOpen,
  ...rest
}: {
  onOpen: () => void;
  [x: string]: unknown;
}) => {
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

export default GuildSettingsSidebar;
