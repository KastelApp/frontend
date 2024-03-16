import { ChannelMarkdown } from "@/components/app/markdown/index.tsx";
import React, { useState, useEffect } from "react";
import { Box, Flex, Image, Text, Button, ListItem, useColorModeValue, Link, List } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AutoResizeTextarea } from "@/components/AutoResizeTextarea.tsx";

const Header = ({ username, creationTimestamp, editTimestamp }: { username: string, creationTimestamp: string, editTimestamp: string; }) => (
    <Box>
        <Flex justify="space-between" align="center" p={4}>
            <Flex direction="column" align="start">
                <Image src="/icon.png" alt="User" boxSize="50px" borderRadius="full" mb={2} />
                <Text fontSize="xl" fontWeight="bold">{username}</Text>
                <Text fontSize="sm">
                    Created {creationTimestamp} &nbsp;●&nbsp; Edited {editTimestamp}
                </Text>
            </Flex>
            <Flex>
                <Button colorScheme="blue" mr={2}>Edit</Button>
                <Button colorScheme="blue">View Edit History</Button>
            </Flex>
        </Flex>
    </Box>
);


interface Header {
    id: string;
    text: string;
}

const TableOfContents = ({ title, children }: { title: string, children: React.ReactNode; }) => {
    const background = useColorModeValue("#e6e9ef", "#101319");
    const color = useColorModeValue("gray.700", "gray.400");

    return (
        <Box
            aria-labelledby='toc-title'
            w={"200px"}
            position='sticky'
            pr='4'
            fontSize='sm'
            bg={background}
            maxH="calc(100vh - 100px)"
            h="100vh"
        >
            {title && (
                <Text
                    id='toc-title'
                    textTransform='uppercase'
                    fontWeight='bold'
                    fontSize='xs'
                    color={color}
                    letterSpacing='wide'
                    ml={4}
                >
                    {title}
                </Text>
            )}
            {children}
        </Box>
    );
};


const MarkdownMessage = ({ markdownContent }: { markdownContent: string; }) => (
    <Box ml={4}>
        <ChannelMarkdown>{markdownContent}</ChannelMarkdown>
    </Box>
);


const MarkdownChannel = () => {
    const router = useRouter();
    const [markdownContent, setMarkdownContent] = useState("");
    const [headers, setHeaders] = useState<Header[]>([]);

    const username = "DarkerInk";
    const creationTimestamp = "Yesterday at 6:00 PM";
    const editTimestamp = "Today at 5:00 PM";
    const hoverBg = useColorModeValue("gray.100", "gray.800");


    useEffect(() => {
        setMarkdownContent("# Header 1\n\n## Header 2\n\n### Header 3\n\nThis is a test!, This is very cool! This took like 30 minutes to make!\n\n - Test\n - Test2\n - Test3\n - [ ] Test\n - [x] Test2");
        setHeaders([
            { id: "header-1", text: "Header 1" },
            { id: "header-2", text: "Header 2" },
            { id: "header-3", text: "Header 3" },
        ]);
    }, []);

    return (
        <Flex overflowY={"auto"}>
            {/* temp input */}
            <Box flex="1" justifyContent="center" userSelect={"none"} overflowY={"auto"}>  
            <AutoResizeTextarea defaultValue={markdownContent} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMarkdownContent(e.target.value)} />
                <Header username={username} creationTimestamp={creationTimestamp} editTimestamp={editTimestamp} />
                <MarkdownMessage markdownContent={markdownContent} />
            </Box>
            <TableOfContents title="In this channel">
                <List spacing={1} ml={0} mt={4}>
                    {headers.map((header, index) => (
                        <ListItem key={index} _hover={{ bg: hoverBg }} ml={2} rounded={4} fontSize="md" pt={1} pb={1}>
                            <Link
                                href={`#${header.id}`}
                                color="gray.300"
                                textDecoration="none"
                                _hover={{ textDecoration: "none" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push(`#${header.id}`);
                                }}
                            >
                                <Flex ml={1}>
                                    <Text ml={1}>{header.text}</Text>
                                </Flex>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </TableOfContents>
        </Flex>
    );
};



export default MarkdownChannel;