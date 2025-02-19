import PopUpImage from "@/components/PopUpImage.tsx";
import { Embed } from "@/types/embed.ts";

const VideoEmbed = ({ embed }: { embed: Embed; }) => {
	const firstFile = embed.files?.[0];

	if (!firstFile) return null;

	return (
		<div className="inline-block w-auto rounded-md max-w-[400px]">
			<PopUpImage
				images={embed.files}
			/>
		</div>
	);
};

export default VideoEmbed;
