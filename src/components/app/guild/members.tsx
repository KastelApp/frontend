import { useRecoilState } from "recoil";
import { currentGuild } from "@/utils/stores.ts";
import {
  Badge,
  Box,
  Flex,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";

const GuildMembers = () => {
  const [guild] = useRecoilState(currentGuild);

  return guild ? (
    <Box>
      <Popover placement={"left"}>
        <PopoverTrigger>
          <Flex
            _hover={{
              bg: "gray.700",
              rounded: "10px",
              cursor: "pointer",
            }}
            mt={2}
            ml={2}
            mr={2}
          >
            <Box ml={2} display="flex" alignItems="center" py={1}>
              <Box
                boxSize="30px"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                overflow="visible"
                lineHeight="none"
                borderRadius="full"
                position="relative"
              >
                <Image
                  borderRadius={"full"}
                  src={"/icon-1.png"}
                  alt={"Loading"}
                  fit="cover"
                />
                <Badge
                  boxSize="3"
                  borderRadius="full"
                  bg={"green"}
                  position="absolute"
                  bottom="-0.5"
                  right="-0.5"
                />
              </Box>
            </Box>
            <Text ml={2} mt={1}>
              Testing
            </Text>
          </Flex>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>test</PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  ) : null;
};

export default GuildMembers;
