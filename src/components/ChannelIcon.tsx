import { channelTypes } from "@/utils/Constants.ts";
import { BookA, Hash, NotebookPen, Volume2 } from "lucide-react";

const ChannelIcon = ({ type, size = 18, className }: { type: number; size?: number; className?: string }) => {
	if (type === channelTypes.HubText) return <Hash size={size} color="#acaebf" className={className} />;

	if (type === channelTypes.HubRules) return <BookA size={size} color="#acaebf" className={className} />;

	if (type === channelTypes.HubVoice) return <Volume2 size={size} color="#acaebf" className={className} />;

	if (type === channelTypes.HubMarkdown) return <NotebookPen size={size} color="#acaebf" className={className} />;
};

export default ChannelIcon;
