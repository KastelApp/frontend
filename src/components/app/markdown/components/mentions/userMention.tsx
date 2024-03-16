import Mention from "./mention.tsx";
import { Text } from "@chakra-ui/react";
import { useMemberStore, useUserStore } from "$/utils/Stores.ts";

const UserMention = ({
    userId,
    onClick
}: {
    userId: string;
    onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}) => {
    const { users } = useUserStore();
    const members  = useMemberStore((s) => s.getCurrentMembers());

    const user = users.find((user) => user.id === userId);
    const member = members.find((member) => member.userId === userId);

    return (
        <Mention onClick={onClick}>
            <Text as="span">
                {!user ? "<" : ""}@{user ? member ? member.displayUsername : user.displayUsername : userId}{!user ? ">" : ""}
            </Text>
        </Mention>
    );
};

export const userMention = {
    order: 1,
    match: (source: string) => /^<@(\d+)>/.exec(source),
    parse: ([, id]: [unknown, string]) => ({ id }),
    react: ({ id }: { id: string }, _: unknown, state: { key: string }) => (
        <UserMention userId={id} key={state.key} />
    ),
}

export default UserMention;