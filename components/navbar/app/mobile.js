import React, {useEffect} from "react";
import {
    Avatar,
    Box,
    Flex,
    HStack,
    IconButton,
    Link,
    List,
    ListIcon,
    ListItem,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    useColorModeValue,
    VStack
} from "@chakra-ui/react";
import {FiBell, FiChevronDown, FiMenu} from "react-icons/fi";
import NextLink from "next/link";
import {CloseIcon} from "@chakra-ui/icons";

const MobileNav = ({userInfo, onOpen, ...rest}) => {
    const initialFocusRef = React.useRef()
    const [count, setCount] = React.useState(0);

    useEffect(() => {
        if (!userInfo?.emailVerified) {
            setCount(count + 1);
        }
    }, [])
    return (
        <Flex
            ml={{base: 0, md: 30}}
            px={{base: 4, md: 4}}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{base: 'space-between', md: 'flex-end'}}
            {...rest}>
            <IconButton
                display={{base: 'flex', md: 'none'}}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu/>}
            />

            <Text
                display={{base: 'flex', md: 'none'}}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Kastel
            </Text>

            <HStack spacing={{base: '0', md: '6'}}>

                <Popover>

                    <PopoverTrigger>
                        <IconButton
                            size="lg"
                            variant="ghost"
                            aria-label={'Notifications'}

                            py={'2'}
                            icon={<>
                                <FiBell/>
                                <Box as={'span'} color={'white'} position={'absolute'} top={'6px'} right={'4px'}
                                     fontSize={'0.8rem'}
                                     borderRadius={'lg'} zIndex={9999} p={'1px'}>
                                    {count > 0 && count}
                                </Box>
                            </>}

                        />

                    </PopoverTrigger>


                    <PopoverContent color='white' bg='blue.800' borderColor='blue.800'>
                        {/* notification listing */}
                        <PopoverBody>
                            <List spacing={3}>
                                {!userInfo?.emailVerified && <NextLink href={'/app/@me/settings'}>
                                    <ListItem>
                                        <ListIcon as={CloseIcon} color='red.500'/>
                                        Email is not verified, need to resend?
                                    </ListItem>
                                </NextLink>}
                            </List>
                        </PopoverBody>
                    </PopoverContent>

                </Popover>
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{boxShadow: 'none'}}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={'/icon-1.png'}
                                />
                                <VStack
                                    display={{base: 'none', md: 'flex'}}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{userInfo?.Username || "Loading"}</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        Online
                                    </Text>
                                </VStack>
                                <Box display={{base: 'none', md: 'flex'}}>
                                    <FiChevronDown/>
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList>
                            <MenuItemLink href={'/app/@me'}>Profile</MenuItemLink>
                            <MenuItemLink href={'/app/@me/settings'}>Settings</MenuItemLink>
                            <MenuDivider/>
                            <MenuItemLink href={'/app/logout'}>Sign out</MenuItemLink>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};

const MenuItemLink = ({href, icon, children, ...rest}) => {
    return (
        <Link as={NextLink} href={href} style={{textDecoration: 'none'}} _focus={{boxShadow: 'none'}}>
            <MenuItem>{children}</MenuItem>
        </Link>
    );
};

export default MobileNav;