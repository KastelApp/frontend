import ImageGrid, { type Image } from "@/components/ImageGrid.tsx";
import Link from "@/components/Message/Markdown/Link.tsx";
import { modalStore } from "@/wrapper/Stores/GlobalModalStore.ts";
import { UnLazyImage } from "@unlazy/react";

interface PopUpImageProps {
	url?: string;
	thumbHash?: string | null;
	name?: string;
	className?: string;
	images?: Image[];
	classNames?: {
		image?: string;
		container?: string;
		modal?: string;
	};
	alt?: string;
	width?: number;
	height?: number;
	linkTo?: string;
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
	name,
	thumbHash,
	url,
	width = 768,
	height = 1024,
	linkTo,
}: PopUpImageProps) => {
	if (!images && url) {
		images = [{ url, thumbHash, name, width, height, linkTo }];
	}

	return (
		<ImageGrid images={images ?? []} onPress={(image) => {
			modalStore.getState().createModal({
				id: `image-${name ?? "image"}`,
				title: name || "Image",
				body: (
					<div className="flex flex-col items-center space-y-4">
						<UnLazyImage
							src={repairUrl(image.url ?? "")}
							alt={image.alt ?? "Image"}
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
								href={repairUrl((image.linkTo ?? image.url) ?? "")}
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
		}} />
	);
};

export default PopUpImage;
