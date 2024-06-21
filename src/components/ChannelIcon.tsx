import { channelTypes } from "@/utils/Constants.ts";
import { BookA, Hash, NotebookPen, Volume2 } from "lucide-react";

const ChannelIcon = ({
    type,
    size = 18
}: {
    type: number;
    size?: number;
}) => {
    if (type === channelTypes.GuildText) return <Hash size={size} color="#acaebf" />;

    if (type === channelTypes.GuildRules) return <BookA size={size} color="#acaebf" />;

    if (type === channelTypes.GuildVoice) return <Volume2 size={size} color="#acaebf" />;

    if (type === channelTypes.GuildMarkdown) return <NotebookPen size={size} color="#acaebf" />;
};

export default ChannelIcon;