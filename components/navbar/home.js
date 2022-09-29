import {
    chakra,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    Link,
    useColorMode,
    useColorModeValue,
    useDisclosure,
    useUpdateEffect,
} from '@chakra-ui/react'
import {useViewportScroll} from 'framer-motion'
import NextLink from 'next/link'
import {useEffect, useRef, useState} from "react";
import DiscordIcon from "../icons/discord";
import GithubIcon from "../icons/github";
import {FaMoon, FaSun} from 'react-icons/fa'
import LoginButton from "./login-button";
import {MobileNavButton, MobileNavContent} from "./mobile-nav";

const Content = ({user}, props) => {
    const mobileNav = useDisclosure()
    const {toggleColorMode: toggleMode} = useColorMode()
    const text = useColorModeValue('dark', 'light')
    const SwitchIcon = useColorModeValue(FaMoon, FaSun)
    const mobileNavBtnRef = useRef()

    useUpdateEffect(() => {
        mobileNavBtnRef.current?.focus()
    }, [mobileNav.isOpen])
    return (
        <>
            <Flex w='100%' h='100%' px='6' align='center' justify='space-between'>
                <Flex _hover={{
                    pointer: 'cursor',
                }} align='center'>
                    <NextLink href='/' passHref>
                        <Heading as={'a'} size='md'>Kastel</Heading>
                    </NextLink>
                </Flex>

                <Flex
                    justify='flex-end'
                    w='100%'
                    align='center'
                    color='gray.400'
                    maxW='1100px'
                >

                    <HStack spacing='5' display={{base: 'none', md: 'flex'}}>
                        <Link
                            isExternal
                            aria-label='Go to Kastel GitHub page'
                            href={'/github'}
                        >
                            <Icon
                                as={GithubIcon}
                                display='block'
                                transition='color 0.2s'
                                w='5'
                                h='5'
                                _hover={{color: 'gray.600'}}
                            />
                        </Link>
                        <Link isExternal aria-label='Go to Kastel Discord page' href='/discord'>
                            <Icon
                                as={DiscordIcon}
                                display='block'
                                transition='color 0.2s'
                                w='5'
                                h='5'
                                _hover={{color: 'gray.600'}}
                            />
                        </Link>
                    </HStack>

                    <HStack spacing='5'>
                        <IconButton
                            size='md'
                            fontSize='lg'
                            aria-label={`Switch to ${text} mode`}
                            variant='ghost'
                            color='current'
                            ml={{base: '0', md: '3'}}
                            onClick={toggleMode}
                            icon={<SwitchIcon/>}
                        />
                        <LoginButton user={user} ml='5'/>
                        <MobileNavButton
                            ref={mobileNavBtnRef}
                            aria-label='Open Menu'
                            onClick={mobileNav.onOpen}
                        />
                    </HStack>
                </Flex>
            </Flex>
            <MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose}/>
        </>
    )
}


const NavBar = ({user}, props) => {
    const {maxW = '8xl', maxWidth = '8xl'} = props
    const ref = useRef()
    const [y, setY] = useState(0)
    const {height = 0} = ref.current?.getBoundingClientRect() ?? {}

    const {scrollY} = useViewportScroll()
    useEffect(() => {
        return scrollY.onChange(() => setY(scrollY.get()))
    }, [scrollY])

    return (
        <chakra.header
            ref={ref}
            shadow={y > height ? 'sm' : undefined}
            transition='box-shadow 0.2s, background-color 0.2s'
            pos='sticky'
            top='0'
            zIndex='3'
            bg='transparent'
            left='0'
            right='0'
            width='full'
            {...props}
        >
            <chakra.div height='4.5rem' mx='auto' maxW={maxW} maxWidth={maxWidth}>
                <Content user={user}/>
            </chakra.div>
        </chakra.header>
    )
}
export default NavBar;