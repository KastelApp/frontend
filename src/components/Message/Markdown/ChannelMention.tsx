import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { Link } from "@nextui-org/react";
import { defaultRules } from "simple-markdown";

const ChannelMention = ({
    channelId,
}: {
    channelId: string;
}) => {
    const foundChannel = useChannelStore((state) => state.getChannel(channelId));

    const LinkMaybe = ({ children, href }: { children: React.ReactNode; href: string | null; }) => {
        if (!href) return <>{children}</>;

        return (
            <Link href={href}>
                {children}
            </Link>
        );
    };

    return (
        <LinkMaybe href={foundChannel ? `/app/guilds/${foundChannel?.guildId}/channels/${channelId}` : null}>
            <span className="rounded-lg p-1 font-medium hover:underline cursor-pointer bg-branding-300/25 text-gray-300">
                #{foundChannel?.name ?? channelId}
            </span>
        </LinkMaybe>
    );
};

export const channelMention = {
    order: defaultRules.paragraph.order,
    match: (source: string) => /^<#(\d+)>/.exec(source),
    parse: ([, id]: [unknown, string]) => ({ id }),
    react: ({ id }: { id: string; }, _: unknown, state: { key: string; }) => (
        <ChannelMention channelId={id} key={state.key} />
    ),
};

export default ChannelMention;