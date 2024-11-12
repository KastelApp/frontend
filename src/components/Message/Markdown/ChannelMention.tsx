import { Routes } from "@/utils/Routes.ts";
import { useChannelStore } from "@/wrapper/Stores/ChannelStore.ts";
import { Link } from "@nextui-org/react";
import { defaultRules } from "@kastelapp/simple-markdown";

const ChannelMention = ({ channelId }: { channelId: string }) => {
	const foundChannel = useChannelStore((state) => state.getChannel(channelId));

	const LinkMaybe = ({ children, href }: { children: React.ReactNode; href: string | null }) => {
		if (!href) return <>{children}</>;

		return <Link href={href}>{children}</Link>;
	};

	const name = foundChannel?.name ? `#${foundChannel.name}` : `<#${channelId}>`;

	return (
		<LinkMaybe href={foundChannel ? Routes.hubChannel(foundChannel.hubId, foundChannel.id) : null}>
			<span className="cursor-pointer rounded-lg bg-branding-300/25 p-1 font-medium text-gray-300 hover:underline">
				{name}
			</span>
		</LinkMaybe>
	);
};

export const channelMention = {
	order: defaultRules.paragraph.order,
	match: (source: string) => /^<#(\d+)>/.exec(source),
	parse: ([, id]: [unknown, string]) => ({ id }),
	react: ({ id }: { id: string }, _: unknown, state: { key: string }) => (
		<ChannelMention channelId={id} key={state.key} />
	),
};

export default ChannelMention;
