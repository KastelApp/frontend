import {Box} from '@chakra-ui/react'
import React from 'react'
import NextLink from 'next/link'

const LoginButton = (props) => (
    <NextLink href='/login' passHref>
        <Box
            display={{base: 'none', lg: 'flex'}}
            alignItems='center'
            aria-label='Login to Kastel'
            rel='noopener noreferrer'
            bg='gray.50'
            borderWidth='1px'
            borderColor='gray.200'
            px='1em'
            minH='36px'
            borderRadius='md'
            fontSize='sm'
            color='gray.800'
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
                Login
            </Box>
        </Box>
    </NextLink>
)

export default LoginButton