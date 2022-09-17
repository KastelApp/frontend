import {
    Box,
    Center,
    CloseButton,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    IconButton,
    useBreakpointValue,
    useColorModeValue,
    useUpdateEffect,
} from '@chakra-ui/react'
import {AnimatePresence, motion} from 'framer-motion'
import NextLink from 'next/link'
import {useRouter} from 'next/router'
import {forwardRef, useEffect, useRef, useState} from 'react'
import {AiOutlineMenu} from 'react-icons/ai'
import {RemoveScroll} from 'react-remove-scroll'
import RouterEvents from "../../utils/router-events";

function NavLink({href, children}) {
    const router = useRouter()
    const bgActiveHoverColor = useColorModeValue('gray.100', 'whiteAlpha.100')

    const isActive = router.asPath.startsWith(href)

    return (
        <GridItem as={NextLink} href={href}>
            <Center
                flex='1'
                minH='40px'
                as='button'
                rounded='md'
                transition='0.2s all'
                fontWeight={isActive ? 'semibold' : 'medium'}
                bg={isActive ? 'teal.400' : undefined}
                borderWidth={isActive ? undefined : '1px'}
                color={isActive ? 'white' : undefined}
                _hover={{
                    bg: isActive ? 'teal.500' : bgActiveHoverColor,
                }}
            >
                {children}
            </Center>
        </GridItem>
    )
}

export function MobileNavContent(props) {
    const {isOpen, onClose} = props
    const closeBtnRef = useRef()
    const {pathname, asPath} = useRouter()
    const bgColor = useColorModeValue('white', 'gray.800')

    RouterEvents.on('routeChangeComplete', (url) => {
        onClose()
    })

    /**
     * Scenario: Menu is open on mobile, and user resizes to desktop/tablet viewport.
     * Result: We'll close the menu
     */
    const showOnBreakpoint = useBreakpointValue({base: true, lg: false})

    useEffect(() => {
        if (showOnBreakpoint == false) {
            onClose()
        }
    }, [showOnBreakpoint, onClose])

    useUpdateEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => {
                closeBtnRef.current?.focus()
            })
        }
    }, [isOpen])

    const [shadow, setShadow] = useState()
    let mainNavLinks = [
        {href: '/', label: 'Home'},
        {href: '/github', label: 'Github'},
        {href: '/discord', label: 'Discord'},
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <RemoveScroll forwardProps>
                    <motion.div
                        transition={{duration: 0.08}}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <Flex
                            direction='column'
                            w='100%'
                            bg={bgColor}
                            h='100vh'
                            overflow='auto'
                            pos='absolute'
                            top='0'
                            left='0'
                            zIndex={20}
                            pb='8'
                        >
                            <Box>
                                <Flex justify='space-between' px='6' pt='5' pb='4'>
                                    <Heading size='md'>Kastel</Heading>
                                    <HStack spacing='5'>
                                        <CloseButton ref={closeBtnRef} onClick={onClose}/>
                                    </HStack>
                                </Flex>
                                <Grid
                                    px='6'
                                    pb='6'
                                    pt='2'
                                    shadow={shadow}
                                    templateColumns='repeat(2, 1fr)'
                                    gap='2'
                                >
                                    {mainNavLinks.map((item) => (
                                        <NavLink href={item.href} key={item.label}>
                                            {item.label}
                                        </NavLink>
                                    ))}
                                </Grid>
                            </Box>
                        </Flex>
                    </motion.div>
                </RemoveScroll>
            )}
        </AnimatePresence>
    )
}

/* eslint-disable react/display-name */
export const MobileNavButton = forwardRef(
    (props, ref) => {
        return (
            <IconButton
                ref={ref}
                display={{base: 'flex', md: 'none'}}
                aria-label='Open menu'
                fontSize='20px'
                color={useColorModeValue('gray.800', 'inherit')}
                variant='ghost'
                icon={<AiOutlineMenu/>}
                {...props}
            />
        )
    },
)