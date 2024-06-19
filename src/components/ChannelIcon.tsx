import { channelTypes } from "@/utils/Constants.ts";
import { BookA, Hash, NotebookPen, Volume2 } from "lucide-react";

const ChannelIcon = ({
    type
}: {
    type: number;
}) => {
    if (type === channelTypes.GuildText) return <Hash size={18} color="#acaebf" />;

    if (type === channelTypes.GuildRules) return <BookA size={18} color="#acaebf" />;

    if (type === channelTypes.GuildVoice) return <Volume2 size={18} color="#acaebf" />;

    if (type === channelTypes.GuildMarkdown) return <NotebookPen size={18} color="#acaebf" />;
};

export default ChannelIcon;