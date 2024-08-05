import { useUserStore } from "@/wrapper/Stores/UserStore.ts";
import { defaultRules } from "simple-markdown";

const UserMention = ({
    userId,
}: {
    userId: string;
    onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
}) => {
    const foundUser = useUserStore((state) => state.getUser(userId));

    return (
        <span className="bg-branding-300/25 rounded-lg p-1 font-medium">
            {!foundUser ? `<@${userId}>` : "kek"}
        </span>
    )
};

export const userMention = {
    order: defaultRules.paragraph.order,
    match: (source: string) => /^<@(\d+)>/.exec(source),
    parse: ([, id]: [unknown, string]) => ({ id }),
    react: ({ id }: { id: string; }, _: unknown, state: { key: string; }) => (
        <UserMention userId={id} key={state.key} />
    ),
};

export default UserMention;