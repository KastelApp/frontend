import cn from "@/utils/cn.ts";
import { UnLazyImage } from "@unlazy/react";

interface Image {
    url: string;
    thumbHash?: string | null;
    name?: string;
}

const ImageGrid = ({ images, onClick, style }: { images: Image[]; onClick?: () => void; style?: React.CSSProperties }) => {
    return (
        <div className="grid gap-2 mb-2">
            {images.length === 1 && (
                <div className={"flex justify-center max-w-96 max-h-56"}>
                    <UnLazyImage
                        src={images[0].url}
                        alt="Image"
                        thumbhash={images[0].thumbHash ?? undefined}
                        className={cn("rounded-none max-w-96 max-h-56", onClick && "cursor-pointer")}
                        onClick={onClick}
                        style={style} // ? only takes affect on the first one for now
                    />
                </div>
            )}

            {images.length === 2 && (
                <div className="flex gap-2">
                    {images.map((img, index) => (
                        <div key={index} className={"max-w-48 max-h-56 flex-shrink-0"}>
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
                    <div className={"flex-1 max-w-52 max-h-full"}>
                        <UnLazyImage
                            src={images[0].url}
                            alt="Large Image"
                            className={cn("h-full rounded-none", onClick && "cursor-pointer")}
                        />
                    </div>
                    <div className="flex flex-col justify-between ml-1 gap-y-1">
                        {images.slice(1).map((img, index) => (
                            <UnLazyImage
                                src={img.url}
                                alt={`Small Image ${index + 1}`}
                                key={index}
                                className={cn("max-w-60 max-h-24 rounded-none", onClick && "cursor-pointer")}
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
                        <div key={index} className={"max-w-48 max-h-48"}>
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
