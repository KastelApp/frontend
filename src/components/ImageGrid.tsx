import { UnLazyImage } from "@unlazy/react";
import cn from "@/utils/cn.ts";

export interface Image {
	url: string;
	thumbHash?: string | null;
	name?: string;
	alt?: string;
	width?: number;
	height?: number;
	linkTo?: string;
}

interface ImageGridProps {
	images: Image[];
	onPress?: (image: Image) => void;
}

const ImageGrid = ({ images, onPress }: ImageGridProps) => {
	const imageCount = images.length;

	if (imageCount === 0) return null;

	return (
		<div className="grid gap-1 max-w-[400px]">
			{imageCount === 1 && (
				<SingleImage image={images[0]} onPress={onPress} />
			)}
			{imageCount === 2 && (
				<div className="grid grid-cols-2 gap-1">
					{images.map((img, index) => (
						<SingleImage key={index} image={img} onPress={onPress} maxWidth={198} maxHeight={224} />
					))}
				</div>
			)}
			{imageCount === 3 && (
				<div className="grid grid-cols-2 gap-1">
					<div className="grid gap-1">
						{images.slice(0, 2).map((img, index) => (
							<SingleImage key={index} image={img} onPress={onPress} maxWidth={198} maxHeight={111} />
						))}
					</div>
					<SingleImage image={images[2]} onPress={onPress} maxWidth={198} maxHeight={224} />
				</div>
			)}
			{imageCount === 4 && (
				<div className="grid grid-cols-2 gap-1">
					{images.map((img, index) => (
						<SingleImage key={index} image={img} onPress={onPress} maxWidth={198} maxHeight={111} />
					))}
				</div>
			)}
		</div>
	);
}

interface SingleImageProps {
	image: Image;
	onPress?: (image: Image) => void;
	maxWidth?: number;
	maxHeight?: number;
}

const SingleImage = ({ image, onPress, maxWidth = 400, maxHeight = 224 }: SingleImageProps) => {
	return (
		<div
			className={cn(
				"overflow-hidden",
				onPress && "cursor-pointer"
			)}
			style={{
				maxWidth: `${maxWidth}px`,
				maxHeight: `${maxHeight}px`,
			}}
		>
			<UnLazyImage
				src={image.url}
				alt={image.alt || "Image"}
				thumbhash={image.thumbHash ?? undefined}
				className="w-full h-full object-cover"
				onClick={() => onPress && onPress(image)}
				style={{
					aspectRatio: image.width && image.height ? `${image.width} / ${image.height}` : undefined,
				}}
			/>
		</div>
	);
}

export default ImageGrid;

export { SingleImage };