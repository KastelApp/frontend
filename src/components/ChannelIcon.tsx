import { channelTypes } from "@/utils/Constants.ts";
import { BookA, Hash, NotebookPen, Volume2 } from "lucide-react";

const ChannelIcon = ({
    type,
    size = 18,
    className
}: {
    type: number;
    size?: number;
    className?: string
}) => {
    if (type === channelTypes.GuildText) return <Hash size={size} color="#acaebf" className={className} />;

    if (type === channelTypes.GuildRules) return <BookA size={size} color="#acaebf" className={className} />;

    if (type === channelTypes.GuildVoice) return <Volume2 size={size} color="#acaebf" className={className} />;

    if (type === channelTypes.GuildMarkdown) return <NotebookPen size={size} color="#acaebf" className={className} />;
};

export default ChannelIcon;