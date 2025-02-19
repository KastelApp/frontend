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
				images={embed.files}
			/>
		</div>
	);
};

export default ImageEmbed;
