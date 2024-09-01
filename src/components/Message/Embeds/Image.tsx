import { Embed } from "@/components/Message/Embeds/RichEmbed.tsx";
import PopUpImage from "@/components/PopUpImage.tsx";

const ImageEmbed = ({ embed }: { embed: Embed }) => {
	const firstFile = embed.files?.[0];

	if (!firstFile) return null;

	const fixedUrl = new URL(firstFile.url);

	fixedUrl.searchParams.set("width", "400");

	return (
		<div className="inline-block w-auto rounded-md">
			<PopUpImage
				url={fixedUrl.toString()}
				alt={firstFile.name ?? "Image"}
				thumbHash={firstFile.thumbHash ?? undefined}
				style={{
					minWidth: "400px",
					minHeight: "215px",
					maxWidth: "400px",
					maxHeight: "215px",
				}}
			/>
		</div>
	);
};

export default ImageEmbed;
