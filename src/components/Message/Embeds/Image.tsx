import PopUpImage from "@/components/PopUpImage.tsx";
import { Embed } from "@/types/embed.ts";

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
				width={firstFile.width}
				height={firstFile.height}
				linkTo={firstFile.rawUrl}
			/>
		</div>
	);
};

export default ImageEmbed;
