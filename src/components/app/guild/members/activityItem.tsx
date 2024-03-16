import { Flex, Image, Text } from "@chakra-ui/react";

const ActivityItem = ({ activity, index }: {
    activity: { name: string, state: string },
    index: number
}) => {
    return (
        <Flex
            mt={1}
            cursor={"default"}
            key={index}
        >
            <Image
                src={"/icon-1.png"}
                boxSize={12}
                borderRadius={10}
                alt="img"
            />
            <Flex
                direction={"column"}
                ml={2}
                overflow={"hidden"}
                textOverflow={"ellipsis"}
                whiteSpace={"nowrap"}
                maxW={"150px"}
            >
                <Text
                    fontSize={"sm"}
                    color={"gray.300"}
                    userSelect={"none"}
                >
                    {activity.name}
                </Text>
                <Text
                    fontSize={"sm"}
                    color={"gray.400"}
                    userSelect={"none"}
                >
                    {activity.state}
                </Text>
                <Text
                    fontSize={"sm"}
                    color={"gray.400"}
                    userSelect={"none"}
                >
                    for 1 minute
                </Text>
            </Flex>
        </Flex>
    );
};

export default ActivityItem;