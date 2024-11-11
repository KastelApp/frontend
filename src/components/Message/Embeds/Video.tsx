import { Embed } from "@/types/embed.ts";

const VideoEmbed = ({ embed }: { embed: Embed }) => {
	const firstFile = embed.files?.[0];

	if (!firstFile) return null;

	return (
		<div className="inline-block w-auto rounded-md">
			<video
				style={{
					minWidth: "400px",
					minHeight: "215px",
					maxWidth: "400px",
					maxHeight: "215px",
				}}
				controls
			>
				<source src={firstFile.url} type={"video/mp4"} />
			</video>
		</div>
	);
};

export default VideoEmbed;
