import React from 'react';
import {
    Box,
    Circle,
    CloseButton,
    Divider,
    Drawer,
    DrawerContent,
    Flex,
    Icon,
    Link,
    Stack,
    Text,
    Tooltip,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import {FiHome} from 'react-icons/fi';
import NextLink from 'next/link'
import NewServer from "../../app/new-server";
import MobileNav from "./mobile";

const LinkItems = [
    {name: 'Home', icon: FiHome, url: '/app/@me'},
];

export default function AppNav({userInfo, children}) {
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                guilds={userInfo?.Guilds}
                userInfo={userInfo?.User}
                onClose={() => onClose}
                display={{base: 'none', md: 'block'}}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent guilds={userInfo?.Guilds}
                                    userInfo={userInfo?.User} onClose={onClose}/>
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav userInfo={userInfo?.User} onOpen={onOpen}/>
            <Box ml={{base: 0, md: 60}} p="4">
                {children}
            </Box>
        </Box>
    );
}

const SidebarContent = ({guilds, userInfo, onClose, ...rest}) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{base: 'full', md: '10%'}}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="5" justifyContent="space-between">
                <NextLink href={'/app/@me'} passHref>
                    <Text as={'a'} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                        Kastel
                    </Text>
                </NextLink>
                <CloseButton display={{base: 'flex', md: 'none'}} onClick={onClose}/>
            </Flex>

            {/*
            temp removal
            {LinkItems.map((link) => (
                <NextLink href={link.url} key={link.name}>
                    <NavItem key={link.name} icon={link.icon}>
                        {link.name}
                    </NavItem>
                </NextLink>
            ))}*/}

            <Divider/>
            {/* Guild Listing */}


            <Stack h="20" mt={5} alignItems="center" mx="8" justifyContent="space-between">

                {guilds && guilds.map((guild) => {
                    return (
                        <GuildItem guild={guild} key={guild.Id}/>
                    )
                })
                }

                <Tooltip hasArrow label='Create new guild' placement='right'>
                    <NewServer userInfo={userInfo?.User}/>
                </Tooltip>
            </Stack>

        </Box>
    );
};

const GuildItem = ({guild, ...rest}) => {
    return (
        <NextLink href={'/app/channels/' + guild?.Id || '0' + '/' + guild?.Channels[0]?.Id || '0'} passHref>
            <Box marginBottom={2}>
                <Tooltip color={useColorModeValue('gray.800', 'white')}
                         bg={useColorModeValue('white', 'gray.700')}
                         hasArrow label={guild?.Name || 'Unknown'} placement='right'>
                    <Circle bg={useColorModeValue('white', 'gray.700')} borderRadius='full'
                            alt={guild?.Name || 'Unknown'}
                            boxSize='40px'>
                        <Text>
                            {guild?.Name?.charAt(0) || 'U'}
                        </Text>
                    </Circle>

                </Tooltip>
            </Box>
        </NextLink>
    )
}

const NavItem = ({url, icon, children, ...rest}) => {
    return (
        <Link href={url} style={{textDecoration: 'none'}} _focus={{boxShadow: 'none'}}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};