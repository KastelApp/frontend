import ImageGrid from "@/components/ImageGrid.tsx";
import { snowflake } from "@/data/constants.ts";
import { modalStore } from "@/wrapper/Stores/GlobalModalStore.ts";
import { Link } from "@nextui-org/react";
import { UnLazyImage } from "@unlazy/react";
import { useState } from "react";

interface Image {
	url: string;
	thumbHash?: string | null;
	name?: string;
	alt?: string;
}

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
}: PopUpImageProps) => {
	const [currentImage] = useState<number>(0); // ? the index

	if (!images && url) {
		images = [{ url, thumbHash, name }];
	}

	console.log(thumbHash, images)

	return (
		<ImageGrid images={images ?? []} onPress={() => {
			console.log(images, snowflake)
			modalStore.getState().createModal({
				id: `image-${name ?? "image"}`,
				title: name || "Image",
				body: (
					<div className="flex flex-col items-center justify-center">
						<div className=" h-[95%] w-[95%] flex flex-col items-center justify-center">
							<UnLazyImage
								// src={repairUrl(images?.[currentImage].url ?? "")}
								alt={images?.[currentImage].alt ?? "Image"}
								thumbhash={images?.[currentImage].thumbHash ?? undefined}
								className="max-h-[80vh] max-w-[80vw]"
								style={{
									width: "auto",
									height: "auto",
								}}
								width={"200px"}
								height={"200px"}
								sizes="90px"
							/>
						</div>
					</div>
				),
				footer: (
					<Link
						href={repairUrl(images?.[currentImage].url ?? "")}
						target="_blank"
						className="mr-auto"
					>
						Open in browser
					</Link>
				)
			});
		}} />
	);
};

export default PopUpImage;
