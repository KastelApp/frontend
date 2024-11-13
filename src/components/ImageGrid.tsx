import cn from "@/utils/cn.ts";
import { UnLazyImage } from "@unlazy/react";

export interface Image {
	url: string;
	thumbHash?: string | null;
	name?: string;
	alt?: string;
	width?: number;
	height?: number;
	linkTo?: string;
}

const ImageGrid = ({
	images,
	onPress,
}: {
	images: Image[];
	onPress?: (image: Image) => void;
	style?: React.CSSProperties;
}) => {
	return (
		<div className="mb-2 grid gap-2">
			{images.length === 1 && (
				<div className={"flex max-h-56 max-w-[25rem] justify-center"}>
					<UnLazyImage
						src={images[0].url}
						alt="Image"
						thumbhash={images[0].thumbHash ?? undefined}
						className={cn("max-h-56 max-w-[25rem] rounded-none", onPress && "cursor-pointer")}
						onClick={() => onPress && onPress(images[0])}
						style={{
							minWidth: images[0].width ? Math.min(images[0].width, 400) : "full",
							minHeight: images[0].height ? Math.min(images[0].height, 224) : "full",
						}}
					/>
				</div>
			)}

			{images.length === 2 && (
				<div className="flex gap-2">
					{images.map((img, index) => (
						<div key={index} className={"max-h-56 max-w-[25rem] flex-shrink-0"}>
							<UnLazyImage
								src={img.url}
								alt={`Image ${index + 1}`}
								className={cn("rounded-none", onPress && "cursor-pointer")}
								thumbhash={img.thumbHash ?? undefined}
								onClick={() => onPress && onPress(img)}
								style={{
									minWidth: img.width ? Math.min(img.width, 400) : "full",
									minHeight: img.height ? Math.min(img.height, 224) : "full",
								}}
							/>
						</div>
					))}
				</div>
			)}

			{images.length === 3 && (
				<div className="flex h-full">
					<div className={"max-h-full max-w-52 flex-1"}>
						<UnLazyImage
							src={images[0].url}
							alt="Large Image"
							className={cn("h-full rounded-none", onPress && "cursor-pointer")}
						/>
					</div>
					<div className="ml-1 flex flex-col justify-between gap-y-1">
						{images.slice(1).map((img, index) => (
							<UnLazyImage
								src={img.url}
								alt={`Small Image ${index + 1}`}
								key={index}
								className={cn("max-h-24 max-w-60 rounded-none", onPress && "cursor-pointer")}
								thumbhash={img.thumbHash ?? undefined}
								onClick={() => onPress && onPress(img)}
								style={{
									minWidth: img.width ? Math.min(img.width, 320) : "full",
									minHeight: img.height ? Math.min(img.height, 144) : "full",
								}}
							/>
						))}
					</div>
				</div>
			)}

			{images.length === 4 && (
				<div className="grid grid-cols-2 gap-y-2">
					{images.map((img, index) => (
						<div key={index} className={"max-h-48 max-w-[25rem]"}>
							<UnLazyImage
								src={img.url}
								alt={`Image ${index + 1}`}
								className={cn("rounded-none", onPress && "cursor-pointer")}
								onClick={() => onPress && onPress(img)}
								style={{
									minWidth: img.width ? Math.min(img.width, 400) : "full",
									minHeight: img.height ? Math.min(img.height, 224) : "full",
								}}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ImageGrid;
