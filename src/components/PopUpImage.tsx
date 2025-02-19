import ImageGrid, { } from "@/components/ImageGrid.tsx";
import Link from "@/components/Message/Markdown/Link.tsx";
import { EmbedFiles } from "@/types/embed.ts";
import { modalStore } from "@/wrapper/Stores/GlobalModalStore.ts";
import { UnLazyImage } from "@unlazy/react";

interface PopUpImageProps {
	className?: string;
	images?: EmbedFiles[];
	classNames?: {
		image?: string;
		container?: string;
		modal?: string;
	};
}

const repairUrl = (url: string) => {
	// ? repair basically just removes the width and height query params
	const fixedUrl = new URL(url);

	fixedUrl.searchParams.delete("width");
	fixedUrl.searchParams.delete("height");

	return fixedUrl.toString();
};

const PopUpImage = ({
	images,
}: PopUpImageProps) => {
	return (
		<ImageGrid files={images ?? []}
			onPress={(image) => {
				if (image.type !== "Image") return;

				modalStore.getState().createModal({
					id: `image-${image.name ?? "image"}`,
					title: image.name || "Image",
					body: (
						<div className="flex flex-col items-center space-y-4">
							<UnLazyImage
								src={repairUrl(image.url ?? "")}
								thumbhash={image.thumbHash ?? undefined}
								className="max-h-[75vh] max-w-[75vw] w-auto h-auto rounded-md"
								style={{
									width: "100%",
									height: "100%",
									objectFit: "contain",
								}}
							/>
							<div className="w-full text-center mt-2">
								<Link
									href={repairUrl((image.rawUrl ?? image.url) ?? "")}
									target="_blank"
									className="mr-auto"
								>
									Open in browser
								</Link>
							</div>
						</div>
					),
					props: {
						classNames: {
							base: "max-w-[80vw] w-fit",
							footer: "p-0"
						}
					}
				});
			}}
		/>
	);
};

export default PopUpImage;
