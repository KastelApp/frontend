import cn from "@/utils/cn.ts";
import { UnLazyImage } from "@unlazy/react";

interface Image {
	url: string;
	thumbHash?: string | null;
	name?: string;
}

const ImageGrid = ({
	images,
	onClick,
	style,
}: {
	images: Image[];
	onClick?: () => void;
	style?: React.CSSProperties;
}) => {
	return (
		<div className="mb-2 grid gap-2">
			{images.length === 1 && (
				<div className={"flex max-h-56 max-w-96 justify-center"}>
					<UnLazyImage
						src={images[0].url}
						alt="Image"
						thumbhash={images[0].thumbHash ?? undefined}
						className={cn("max-h-56 max-w-96 rounded-none", onClick && "cursor-pointer")}
						onClick={onClick}
						style={style} // ? only takes affect on the first one for now
					/>
				</div>
			)}

			{images.length === 2 && (
				<div className="flex gap-2">
					{images.map((img, index) => (
						<div key={index} className={"max-h-56 max-w-48 flex-shrink-0"}>
							<UnLazyImage
								src={img.url}
								alt={`Image ${index + 1}`}
								className={cn("rounded-none", onClick && "cursor-pointer")}
								thumbhash={img.thumbHash ?? undefined}
								onClick={onClick}
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
							className={cn("h-full rounded-none", onClick && "cursor-pointer")}
						/>
					</div>
					<div className="ml-1 flex flex-col justify-between gap-y-1">
						{images.slice(1).map((img, index) => (
							<UnLazyImage
								src={img.url}
								alt={`Small Image ${index + 1}`}
								key={index}
								className={cn("max-h-24 max-w-60 rounded-none", onClick && "cursor-pointer")}
								thumbhash={img.thumbHash ?? undefined}
								onClick={onClick}
							/>
						))}
					</div>
				</div>
			)}

			{images.length === 4 && (
				<div className="grid grid-cols-2 gap-y-2">
					{images.map((img, index) => (
						<div key={index} className={"max-h-48 max-w-48"}>
							<UnLazyImage
								src={img.url}
								alt={`Image ${index + 1}`}
								className={cn("rounded-none", onClick && "cursor-pointer")}
								onClick={onClick}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ImageGrid;
