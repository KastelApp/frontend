import { defaultRules } from "simple-markdown";
import Mention from "./mention.tsx";
import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { useChannelStore } from "$/utils/Stores.ts";

const ChannelMention = ({ channelId }: { channelId: string }) => {
  const { channels } = useChannelStore();

  const channel = channels.find((channel) => channel.id === channelId);

  return (
    <Mention>
      {channel ? (
        <Link href={`/app/guilds/${channel.guildId}/channels/${channel.id}`}>
          <Text as="span">#{channel.name}</Text>
        </Link>
      ) : (
        <Text as="span">&lt;#{channelId}&gt;</Text>
      )}
    </Mention>
  );
};

export const channelMention = {
  order: defaultRules.text.order,
  match: (source: string) => /^<#(\d+)>/.exec(source),
  parse: ([, id]: [unknown, string]) => ({ id }),
  react: ({ id }: { id: string }, _: unknown, state: { key: string }) => (
    <ChannelMention channelId={id} key={state.key} />
  ),
};

export default ChannelMention;
