import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Switch,
  VStack,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRoleStore } from "$/utils/Stores.ts";
import Role from "$/Client/Structures/Guild/Role.ts";
import permissionsDescriptions from "@/utils/permissions.ts";

const ColorPicker = ({ selectedRole }: { selectedRole: Role; }) => {
  const colors = [
    // Reddish colors
    "#FF5733", // Reddish-orange
    "#FF6347", // Tomato
    "#FF4500", // Orange-red
    "#FF0000", // Red

    // Yellowish colors
    "#FFD700", // Gold
    "#FFA500", // Orange
    "#FFFF00", // Yellow

    // Greenish colors
    "#00FF00", // Lime
    "#7FFF00", // Chartreuse
    "#11806a", // Green

    // Bluish colors
    "#87CEEB", // Sky blue
    "#5e85ce", // Glaucous
    "#0000FF", // Blue

    // Purple colors
    "#800080", // Purple
    "#8A2BE2", // Blue-violet
    "#9932CC", // Dark orchid

    // Other colors
    "#FF1493", // Deep pink
    "#00CED1", // Dark turquoise
    "#BA55D3", // Medium orchid
    "#800000", // Maroon
  ];

  return (
    <Flex>
      <Box cursor={"pointer"} w="45px" h="45px" borderRadius="5px" bg="gray.300" mr={2} /> {/* Default color square */}
      <Box cursor={"pointer"} w="45px" h="45px" borderRadius="5px" bg={selectedRole?.hexColor} mr={2} /> {/* Current color square */}

      <VStack spacing={2} align="start">
        <HStack spacing={2}>
          {colors.slice(0, 10).map((color, index) => (
            <Box cursor={"pointer"} key={index} w="20px" h="20px" borderRadius="5px" bg={color} onClick={() => selectedRole.color = parseInt(color.replace("#", ""), 16)} />
          ))}
        </HStack>
        <HStack spacing={2}>
          {colors.slice(10).map((color, index) => (
            <Box cursor={"pointer"} key={index + 10} w="20px" h="20px" borderRadius="5px" bg={color} onClick={() => selectedRole.color = parseInt(color.replace("#", ""), 16)} />
          ))}
        </HStack>
      </VStack>
    </Flex>
  );
};


const GuildSettingsRoles = () => {
  const { getCurrentRoles } = useRoleStore();
  const roles = getCurrentRoles();
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0]);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [clicked, setClicked] = useState(false);

  const bg = useColorModeValue("gray.100", "gray.700");
  const hoverbg = useColorModeValue("gray.200", "gray.600");
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (selectedRole?.id === selectedRole?.guildId) {
      setTab(1);
    } else {
      setTab(0);
    }
  }, [selectedRole])

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        Roles
      </Text>

      <Box as="form">
        <Stack
          spacing={1}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={6}
        >
          <Flex>
            <Box mr={4} maxW={"calc(100vw - 95%)"} w={"full"}>
              <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <IconButton
                  aria-label="Add Role"
                  icon={<AddIcon />}
                  colorScheme="blue"
                />
              </Flex>
              <VStack spacing={4} align="start">
                {roles.map((role) => (
                  <HStack key={role.id} spacing={4} onClick={() => setSelectedRole(role)} w="full" h="40px"
                    _hover={{
                      bg: hoverbg
                    }}
                    borderRadius={"5px"}
                    userSelect={"none"}
                    cursor={"pointer"}
                  >
                    <Box
                      w="20px"
                      h="20px"
                      borderRadius="full"
                      bg={role.hexColor}
                      ml={2}
                    ></Box>
                    <Text isTruncated>{role.name}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
            {selectedRole && (
              <>
                <Box flex="3" userSelect={"none"}>
                  <Tabs defaultIndex={selectedRole?.id === selectedRole?.guildId ? 1 : 0} index={tab} onChange={(index) => setTab(index)}>
                    <TabList>
                      <Tab isDisabled={selectedRole.id === selectedRole.guildId}>Information</Tab>
                      <Tab>Permissions</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <FormControl>
                          <FormLabel>Role Name</FormLabel>
                          <Input placeholder="Role Name" value={selectedRole.name} isReadOnly />
                        </FormControl>
                        <FormControl mt={4}>
                          <FormLabel>Role Color</FormLabel>
                          <ColorPicker selectedRole={selectedRole} />
                        </FormControl>
                        <FormControl mt={4}>
                          <Flex justifyContent="space-between" alignItems="center" cursor={"pointer"} onClick={() => setClicked(!clicked)}>
                            <FormLabel>Display role above online members</FormLabel>
                            <Switch isChecked={clicked} onChange={(e) => setClicked(!e.target.checked)} />
                          </Flex>
                        </FormControl>
                        <FormControl mt={4}>
                          <Flex justifyContent="space-between" alignItems="center" cursor={"pointer"} onClick={() => setClicked(!clicked)}>
                            <FormLabel>Allow anyone to @mention</FormLabel>
                            <Switch isChecked={clicked} onChange={(e) => setClicked(!e.target.checked)} />
                          </Flex>
                        </FormControl>
                        <FormControl mt={4}>
                          <Flex justifyContent="space-between" alignItems="center" cursor={"pointer"} onClick={() => setClicked(!clicked)}>
                            <FormLabel>Allow access to age restricted channels</FormLabel>
                            <Switch isChecked={clicked} onChange={(e) => setClicked(!e.target.checked)} />
                          </Flex>
                          <Text fontSize="sm" color="gray.500">Allows anyone with this role to access age restricted channels.</Text>
                        </FormControl>
                      </TabPanel>
                      <TabPanel>
                        <FormControl>
                          <Flex justifyContent="space-between" alignItems="center" mb={2} cursor={"pointer"} onClick={() => setIsAdvancedMode(!isAdvancedMode)}>
                            <FormLabel cursor={"pointer"} >Advanced Mode</FormLabel>
                            <Switch
                              id="advancedModeToggle"
                              size="md"
                              isChecked={isAdvancedMode}
                              onChange={(e) => setIsAdvancedMode(e.target.checked)}
                            />
                          </Flex>
                          <Input mb={4} placeholder="Search Permissions" />
                          {isAdvancedMode ? (
                            <VStack align="start" userSelect={"none"}>
                              {Object.keys(permissionsDescriptions.advanced.groups).map((group) => {
                                const groupData = permissionsDescriptions.advanced.groups[group as keyof typeof permissionsDescriptions.advanced.groups];
                                return (
                                  <Box key={group} w="full" p={4} bg={bg} rounded="md" cursor={"pointer"} onClick={() => setClicked(!clicked)}>
                                    <Flex justifyContent="space-between" alignItems="center">
                                      <Text>{groupData.label}</Text>
                                      <Switch isChecked={clicked} onChange={(e) => setClicked(!e.target.checked)} />
                                    </Flex>
                                    <Text>{groupData.description}</Text>
                                  </Box>
                                );
                              })}
                            </VStack>
                          ) : (
                            <VStack align="start" userSelect={"none"}>
                              {Object.keys(permissionsDescriptions.simple.groups).map((group) => {
                                const groupData = permissionsDescriptions.simple.groups[group as keyof typeof permissionsDescriptions.simple.groups];
                                return (
                                  <Box key={group} w="full" p={4} bg={bg} rounded="md" cursor={"pointer"} onClick={() => setClicked(!clicked)}>
                                    <Flex justifyContent="space-between" alignItems="center">
                                      <Text>{groupData.label}</Text>
                                      <Switch isChecked={clicked} onChange={(e) => setClicked(!e.target.checked)} />
                                    </Flex>
                                    <Text>{groupData.description}</Text>
                                  </Box>
                                );
                              })}
                            </VStack>
                          )}
                        </FormControl>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              </>
            )}
          </Flex>
        </Stack>
      </Box>
    </>
  );
};

export default GuildSettingsRoles;
