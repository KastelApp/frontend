import {
    Box,
    Button,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import {FiPlus} from "react-icons/fi";
import React, {useState} from "react";
import * as api from "../../utils/api";
import {getCookie} from "cookies-next";
import {useRouter} from "next/router";

const NewServer = ({userInfo, onClose, ...rest}) => {
    const modal = useDisclosure()
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    let token = getCookie('token') || null;

    const submit = async event => {
        event.preventDefault();
        setLoading(true);

        let name = event.target.name.value;

        if (!name) {
            setLoading(false);
            setError([
                {code: "MISSING_NAME", message: "Please enter a name for your guild."}
            ])
        } else {
            // submit form
            setError(null);
            try {
                let response = await api.newGuild(`${token}`, {name});
                console.log(response);
                if (response?.responses[0]?.code === 'GUILD_CREATED') {
                    setLoading(false);
                    modal.onClose();
                    let GUILD_DATA = response?.responses[0]?.data;
                    if (GUILD_DATA) {
                        router.push(`/app/channels/${GUILD_DATA._id}/${GUILD_DATA.channels[0]}`)
                    } else {
                        router.push(`/app/@me`)
                    }
                } else if (response.errors) {
                    setLoading(false);
                    setError(response?.errors || [{code: "UNKNOWN", message: "An unknown error occurred."}])
                } else {
                    setLoading(false);
                    setError([
                        {code: "UNKNOWN", message: "An unknown error occurred, check logs."}
                    ])
                }

            } catch (error) {
                console.log(error)
                setLoading(false);
                setError([
                    {code: "UNKNOWN", message: "An unknown error occurred, check logs."}
                ])
            }
        }

    }

    return (
        <>
            <Box>
                <IconButton
                    onClick={modal.onOpen}
                    colorScheme='teal'
                    aria-label='New'
                    size='md'
                    icon={<FiPlus/>}
                />
            </Box>

            <Modal onClose={modal.onClose} isOpen={modal.isOpen} isCentered>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Create a Guild</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <form id="new-note" onSubmit={submit}>
                            <Stack spacing={4}>

                                {error && <center><Text bgGradient="linear(to-r, red.400,pink.400)"
                                                        bgClip="text"
                                                        fontSize={{base: 'sm', sm: 'md'}}>
                                    {error.map(err => {
                                        return err.message
                                    })}
                                </Text></center>}

                                <Input
                                    id={'name'}
                                    required={true}
                                    type={'text'}
                                    bg={useColorModeValue('gray.200', 'gray.600')}
                                    placeholder="Name"
                                    border={0}
                                    color={useColorModeValue('gray.900', 'gray.100')}
                                    _placeholder={{
                                        color: useColorModeValue('gray.500', 'gray.100'),
                                    }}
                                />
                            </Stack>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={3} onClick={modal.onClose}>Close</Button>
                        {loading ? <Button isLoading={true}>Next</Button> :
                            <Button form="new-note" type={'submit'}>Next</Button>}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default NewServer;