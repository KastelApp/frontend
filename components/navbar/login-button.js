import { Box } from '@chakra-ui/react'
import React from 'react'

const LoginButton = (props) => (
    <Box
        display={{ base: 'none', lg: 'flex' }}
        alignItems='center'
        as='a'
        aria-label='Login to Kastel'
        href={'/login'}
        rel='noopener noreferrer'
        bg='gray.50'
        borderWidth='1px'
        borderColor='gray.200'
        px='1em'
        minH='36px'
        borderRadius='md'
        fontSize='sm'
        color='gray.800'
        outline='0'
        transition='all 0.3s'
        _hover={{
            bg: 'gray.100',
            borderColor: 'gray.300',
        }}
        _active={{
            borderColor: 'gray.200',
        }}
        _focus={{
            boxShadow: 'outline',
        }}
        {...props}
    >

        <Box as='strong' lineHeight='inherit' fontWeight='semibold'>
            Login Button
        </Box>
    </Box>
)

export default LoginButton