import {
  Box,
  Button,
  chakra,
  CloseButton,
  Flex,
  HStack,
  IconButton,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { AiOutlineMenu } from "react-icons/ai";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { useIsDesktop, useTokenStore } from "@/utils/stores.ts";

const Navbar = () => {
  const bg = useColorModeValue("white", "gray.900");
  const buttonColor = useColorModeValue("#000b2e", "#d1dcff");
  const mobileNav = useDisclosure();
  const [hasToken, setHasToken] = useState(false);
  const { token } = useTokenStore();
  const desktop = useIsDesktop((state) => state.isDesktop);

  useEffect(() => {
    if (token) setHasToken(true);
  }, [token]);

  return (
    <>
      {!desktop && (
        <chakra.header
          w="full"
          px={{
            base: 2,
            sm: 4,
          }}
          py={4}
        >
          <Flex alignItems="center" justifyContent="space-between" mx="auto">
            <Flex>
              <chakra.a
                as={NextLink}
                href={"/"}
                title="Choc Home Page"
                display="flex"
                alignItems="center"
              >
                <chakra.h1 fontSize="xl" fontWeight="medium" ml="2">
                  Kastel
                </chakra.h1>
              </chakra.a>
            </Flex>
            <HStack display="flex" alignItems="center" spacing={1}>
              <HStack
                spacing={1}
                mr={1}
                display={{
                  base: "none",
                  md: "inline-flex",
                }}
              >
                <NextLink target={"_blank"} href={"https://docs.kastelapp.com"}>
                  <Button color={buttonColor} variant="ghost">
                    Docs
                  </Button>
                </NextLink>

                <NextLink
                  target={"_blank"}
                  href={"https://github.com/KastelApp"}
                >
                  <Button color={buttonColor} variant="ghost">
                    GitHub
                  </Button>
                </NextLink>

                <NextLink
                  target={"_blank"}
                  href={"https://discord.gg/f5HgvkRbVP"}
                >
                  <Button color={buttonColor} variant="ghost">
                    Discord
                  </Button>
                </NextLink>
              </HStack>
              <NextLink href={hasToken ? "/app" : "/login"} passHref>
                <Button
                  _hover={{
                    bgGradient: "linear(to-r, red.400,pink.400)",
                    boxShadow: "xl",
                  }}
                  bgGradient="linear(to-r, red.400,pink.400)"
                  color={"white"}
                  size="sm"
                >
                  {hasToken ? "Open App" : "Login"}
                </Button>
              </NextLink>
              <Box
                display={{
                  base: "inline-flex",
                  md: "none",
                }}
              >
                <IconButton
                  display={{
                    base: "flex",
                    md: "none",
                  }}
                  aria-label="Open menu"
                  fontSize="20px"
                  color="gray.800"
                  _dark={{
                    color: "inherit",
                  }}
                  variant="ghost"
                  icon={<AiOutlineMenu />}
                  onClick={mobileNav.onOpen}
                />

                <VStack
                  pos="absolute"
                  top={0}
                  left={0}
                  right={0}
                  display={mobileNav.isOpen ? "flex" : "none"}
                  flexDirection="column"
                  p={2}
                  pb={4}
                  m={2}
                  bg={bg}
                  spacing={3}
                  rounded="sm"
                  shadow="sm"
                >
                  <CloseButton
                    aria-label="Close menu"
                    onClick={mobileNav.onClose}
                  />

                  <NextLink
                    target={"_blank"}
                    href={"https://docs.kastelapp.com"}
                  >
                    <Button w={"full"} variant="ghost">
                      Docs
                    </Button>
                  </NextLink>

                  <NextLink
                    target={"_blank"}
                    href={"https://github.com/KastelApp"}
                  >
                    <Button w={"full"} variant="ghost">
                      GitHub
                    </Button>
                  </NextLink>

                  <NextLink
                    target={"_blank"}
                    href={"https://discord.gg/f5HgvkRbVP"}
                  >
                    <Button w={"full"} variant="ghost">
                      Discord
                    </Button>
                  </NextLink>
                </VStack>
              </Box>
            </HStack>
          </Flex>
        </chakra.header>
      )}
    </>
  );
};

export default Navbar;
