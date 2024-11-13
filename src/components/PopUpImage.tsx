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
	style?: React.CSSProperties;
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
	style
}: PopUpImageProps) => {
	if (!images && url) {
		images = [{ url, thumbHash, name, width, height, linkTo }];
	}

	return (
		<ImageGrid style={style} images={images ?? []} onPress={(image) => {
			modalStore.getState().createModal({
				id: `image-${name ?? "image"}`,
				title: name || "Image",
				body: (
					<div className="flex flex-col">
						<UnLazyImage
							src={repairUrl(image.url ?? "")}
							alt={image.alt ?? "Image"}
							thumbhash={image.thumbHash ?? undefined}
							className="max-h-[70vh] max-w-[75vw] rounded-md"
							style={{
								width: "auto",
								height: "auto",
							}}
						/>
						<Link
							href={repairUrl((image.linkTo ?? image.url) ?? "")}
							target="_blank"
							className="mr-auto"
						>
							Open in browser
						</Link>
					</div>
				),
				props: {
					classNames: {
						base: "max-h-[80vh] max-w-[75vw]",
						footer: "p-0"
					}
				}
			});
		}} />
	);
};

export default PopUpImage;
